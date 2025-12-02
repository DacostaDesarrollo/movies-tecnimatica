namespace backend.DTOs;

public class FavoriteMovieResponseDto
{
    public int Id { get; set; }
    public string ImdbId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Year { get; set; }
    public string? Poster { get; set; }
    public string? Type { get; set; }
    public DateTime CreatedAt { get; set; }
}