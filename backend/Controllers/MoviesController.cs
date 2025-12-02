using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class MoviesController : ControllerBase{
    private readonly IOmdbService _omdbService;

    public MoviesController(IOmdbService omdbService){
        _omdbService = omdbService;
    }

    [HttpGet("search")]
    [ProducesResponseType(typeof(MovieSearchResponseDto), 200)]
    [ProducesResponseType(typeof(ErrorResponseDto), 400)]
    [ProducesResponseType(typeof(ErrorResponseDto), 404)]
    [ProducesResponseType(typeof(ErrorResponseDto), 500)]
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
            return StatusCode(500, new { error = "Error al buscar películas", details = ex.Message });
        }
    }

}