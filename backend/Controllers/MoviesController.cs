using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class MoviesController : ControllerBase{
    private readonly IOmdbService _omdbService;
    private readonly IFavoriteService _favoriteService;
    public MoviesController(IOmdbService omdbService, IFavoriteService favoriteService){
        _omdbService = omdbService;
        _favoriteService = favoriteService; 
    }

    [HttpGet("search")]
    [Authorize]
    [ProducesResponseType(typeof(MovieSearchResponseDto), 200)]
    [ProducesResponseType(typeof(ErrorResponseDto), 400)]
    [ProducesResponseType(typeof(ErrorResponseDto), 404)]
    [ProducesResponseType(typeof(ErrorResponseDto), 500)]
    [ProducesResponseType(401)] 
    public async Task<IActionResult> SearchMovies([FromQuery] string title, [FromQuery] int page = 1, [FromQuery] string type = "movie"){
        try
        {
            if (string.IsNullOrWhiteSpace(title)){
                return BadRequest(new {Error = "El parametro 'title' es obligatorio."});
            }

            if (title.Length < 2){
                return BadRequest(new { error = "El título debe tener al menos 2 caracteres" });
            }

            var result = await _omdbService.SearchMoviesAsync(title, page, type);

            if (result.Response == "False") {
                return NotFound(new { error = result.Error ?? "No se encontraron películas" });
            }

            var response = new MovieSearchResponseDto
            {
                Movies = result.Search,
                TotalResults = int.Parse(result.TotalResults),
                Page = page
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                error = "Error al buscar películas", 
                details = ex.Message 
            });
        }
    }

    [HttpPost("favorites")]
    [Authorize]
    [ProducesResponseType(typeof(FavoriteMovieResponseDto), 201)]
    [ProducesResponseType(typeof(ErrorResponseDto), 400)]
    [ProducesResponseType(typeof(ErrorResponseDto), 500)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> AddFavorite([FromBody] AddFavoriteDto dto)
    {
        try
        {
            // Obtener el ID del usuario del token JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new ErrorResponseDto { Error = "Token inválido" });
            }

            var favorite = await _favoriteService.AddFavoriteAsync(userId, dto);

            var response = new FavoriteMovieResponseDto
            {
                Id = favorite.Id,
                ImdbId = favorite.ImdbId,
                Title = favorite.Title,
                Year = favorite.Year,
                Poster = favorite.Poster,
                Type = favorite.Type,
                CreatedAt = favorite.CreatedAt
            };

            return CreatedAtAction(nameof(GetFavorites), new { }, response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ErrorResponseDto { Error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ErrorResponseDto 
            { 
                Error = "Error al agregar favorito", 
                Details = ex.Message 
            });
        }
    }

    [HttpGet("favorites")]
    [Authorize]
    [ProducesResponseType(typeof(List<FavoriteMovieResponseDto>), 200)]
    [ProducesResponseType(typeof(ErrorResponseDto), 500)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> GetFavorites([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            // Obtener el ID del usuario del token JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new ErrorResponseDto { Error = "Token inválido" });
            }

            var (favorites, totalCount) = await _favoriteService.GetUserFavoritesAsync(userId, page, pageSize);
             
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var response = new PaginatedFavoritesResponseDto
        {
            Favorites = favorites.Select(f => new FavoriteMovieResponseDto
            {
                Id = f.Id,
                ImdbId = f.ImdbId,
                Title = f.Title,
                Year = f.Year,
                Poster = f.Poster,
                Type = f.Type,
                CreatedAt = f.CreatedAt
            }).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasPreviousPage = page > 1,
            HasNextPage = page < totalPages
        };

        return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ErrorResponseDto 
            { 
                Error = "Error al obtener favoritos", 
                Details = ex.Message 
            });
        }
    }


    [HttpDelete("favorites/{favoriteId}")]
    [Authorize]
    [ProducesResponseType(204)]
    [ProducesResponseType(typeof(ErrorResponseDto), 404)]
    [ProducesResponseType(typeof(ErrorResponseDto), 500)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> RemoveFavorite(int favoriteId)
    {
        try
        {
            // Obtener el ID del usuario del token JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new ErrorResponseDto { Error = "Token inválido" });
            }

            var result = await _favoriteService.RemoveFavoriteAsync(userId, favoriteId);

            if (!result)
            {
                return NotFound(new ErrorResponseDto { Error = "Favorito no encontrado o no pertenece al usuario" });
            }

            return NoContent(); // 204 No Content - Eliminado exitosamente
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ErrorResponseDto 
            { 
                Error = "Error al eliminar favorito", 
                Details = ex.Message 
            });
        }
    }

}