namespace backend.DTOs;

public class LoginResponseDto
{
    public required string Name { get; set; }
    public required string Token { get; set; }
    
    public required string Email { get; set; }
}