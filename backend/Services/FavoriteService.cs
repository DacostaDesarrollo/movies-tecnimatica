using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class FavoriteService : IFavoriteService{
    private readonly AppDbContext _context;

    public FavoriteService(AppDbContext context){
        _context = context;
    }

    public async Task<FavoriteMovie> AddFavoriteAsync(int userId, AddFavoriteDto dto){
        // Verificar si ya existe en favoritos
        var existingFavorite = await _context.FavoriteMovies
            .FirstOrDefaultAsync(f => f.UserId == userId && f.ImdbId == dto.ImdbId);

        if (existingFavorite != null){
            throw new InvalidOperationException("Esta película ya está en favoritos");
        }

        var favorite = new FavoriteMovie{
            UserId = userId,
            ImdbId = dto.ImdbId,
            Title = dto.Title,
            Year = dto.Year,
            Poster = dto.Poster,
            Type = dto.Type,
            CreatedAt = DateTime.UtcNow
        };

        _context.FavoriteMovies.Add(favorite);
        await _context.SaveChangesAsync();

        return favorite;
    }

    public async Task<(List<FavoriteMovie> favorites, int totalCount)> GetUserFavoritesAsync(int userId, int page = 1, int pageSize = 10)
    {

        
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 10;

        
        var totalCount = await _context.FavoriteMovies
            .CountAsync(f => f.UserId == userId);

        
        var favorites = await _context.FavoriteMovies
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.CreatedAt)
            .Skip((page - 1) * pageSize)  // El offset 
            .Take(pageSize)               // el limite
            .ToListAsync();

        return (favorites, totalCount);
    }
    public async Task<List<string>> GetUserFavoriteImdbIdsAsync(int userId){
        return await _context.FavoriteMovies
            .Where(f => f.UserId == userId)
            .Select(f => f.ImdbId)
            .ToListAsync();
    }
    public async Task<bool> RemoveFavoriteAsync(int userId, int favoriteId)
    {
        var favorite = await _context.FavoriteMovies
            .FirstOrDefaultAsync(f => f.Id == favoriteId && f.UserId == userId);

        if (favorite == null)
        {
            return false;
        }

        _context.FavoriteMovies.Remove(favorite);
        await _context.SaveChangesAsync();

        return true;
    }
}