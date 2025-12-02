namespace backend.Models;

public class FavoriteMovie
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    public required string ImdbId { get; set; }
    
    public required string Title { get; set; }
    
    public string? Year { get; set; }
    
    public string? Poster { get; set; }
    
    public string? Type { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Relación con User
    public User User { get; set; } = null!;
}