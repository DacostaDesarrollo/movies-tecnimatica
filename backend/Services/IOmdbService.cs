using backend.DTOs;

namespace backend.Services;

public interface IOmdbService
{
    Task<OmdbSearchResponseDto> SearchMoviesAsync(string title, int userId, int page = 1, string type = "movie");
}