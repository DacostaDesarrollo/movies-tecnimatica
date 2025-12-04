using System.Text.Json.Serialization;

namespace backend.DTOs;

public class OmdbMovieDto
{
    [JsonPropertyName("imdbID")]
    public string ImdbID { get; set; } = string.Empty;
    
    [JsonPropertyName("Title")]
    public string Title { get; set; } = string.Empty;
    
    [JsonPropertyName("Year")]
    public string Year { get; set; } = string.Empty;
    
    [JsonPropertyName("Type")]
    public string Type { get; set; } = string.Empty;
    
    [JsonPropertyName("Poster")]
    public string Poster { get; set; } = string.Empty;
    
    [JsonPropertyName("IsFavorite")]
    public bool IsFavorite { get; set; }
}

