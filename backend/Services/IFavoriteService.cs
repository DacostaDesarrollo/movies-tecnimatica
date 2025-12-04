using backend.DTOs;
using backend.Models;

namespace backend.Services;

public interface IFavoriteService
{
    Task<FavoriteMovie> AddFavoriteAsync(int userId, AddFavoriteDto dto);
    Task<(List<FavoriteMovie> favorites, int totalCount)> GetUserFavoritesAsync(int userId, int page = 1, int pageSize = 10);
    Task<bool> RemoveFavoriteAsync(int userId, int favoriteId);
    Task<List<string>> GetUserFavoriteImdbIdsAsync(int userId);
}