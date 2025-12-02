using System.Text.Json.Serialization;

namespace backend.DTOs;
public class OmdbSearchResponseDto
{
    [JsonPropertyName("Search")]
    public List<OmdbMovieDto> Search { get; set; } = new();
    
    [JsonPropertyName("totalResults")]
    public string TotalResults { get; set; } = "0";
    
    [JsonPropertyName("Response")]
    public string Response { get; set; } = "False";
    
    [JsonPropertyName("Error")]
    public string? Error { get; set; }
}