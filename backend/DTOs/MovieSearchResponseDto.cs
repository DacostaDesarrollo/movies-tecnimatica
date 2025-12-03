namespace backend.DTOs;

public class MovieSearchResponseDto
{
    public List<OmdbMovieDto> Movies { get; set; } = new();
    public int TotalResults { get; set; }
    public int Page { get; set; }
    public string Response { get; set; }
}