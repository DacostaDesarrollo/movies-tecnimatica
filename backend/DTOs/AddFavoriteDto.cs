using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class AddFavoriteDto
{
    [Required(ErrorMessage = "El ImdbId es obligatorio")]
    public string ImdbId { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "El título es obligatorio")]
    public string Title { get; set; } = string.Empty;
    
    public string? Year { get; set; }
    
    public string? Poster { get; set; }
    
    public string? Type { get; set; }
}