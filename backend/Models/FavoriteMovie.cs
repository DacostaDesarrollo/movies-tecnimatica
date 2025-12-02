namespace backend.Models;

public class FavoriteMovie{

    public int Id { get; set;}
    
    public int UserId { get; set;}

    public required string ImdbId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}