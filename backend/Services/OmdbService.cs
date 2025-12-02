using backend.DTOs;
using System.Text.Json;

namespace backend.Services;

public class OmdbService : IOmdbService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly string _apiKey;
    private readonly string _baseUrl;

    public OmdbService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _apiKey = _configuration["OMDb:ApiKey"] ?? throw new InvalidOperationException("OMDb API Key no configurada");
        _baseUrl = _configuration["OMDb:BaseUrl"] ?? "https://www.omdbapi.com/";
    }

    public async Task<OmdbSearchResponseDto> SearchMoviesAsync(string title, int page = 1, string type= "movie")
    {
        try
        {
            // Construir la URL con parámetros
            var url = $"{_baseUrl}?apikey={_apiKey}&s={Uri.EscapeDataString(title)}&page={page}&type={type}";
            // Hacer la petición GET
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            
            // Leer el contenido de la respuesta
            var content = await response.Content.ReadAsStringAsync();
            
            // Deserializar JSON a objeto
            var result = JsonSerializer.Deserialize<OmdbSearchResponseDto>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            
            return result ?? new OmdbSearchResponseDto();
        }
        catch (HttpRequestException ex)
        {
            throw new Exception($"Error al conectar con OMDb API: {ex.Message}", ex);
        }
        catch (JsonException ex)
        {
            throw new Exception($"Error al procesar respuesta de OMDb: {ex.Message}", ex);
        }
    }
}