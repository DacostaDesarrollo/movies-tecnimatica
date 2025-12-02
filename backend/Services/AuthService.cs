using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Services;

public class AuthService: IAuthService {

    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService (AppDbContext context, IConfiguration configuration){
        _context = context;
        _configuration = configuration;
    }

    public async Task<User> RegisterAsync(RegisterDto dto){
        var existingUser =  await _context.Users
        .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if(existingUser != null){
            throw new InvalidOperationException("El Email ya esta Registrado!");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        //Crear el usuario nuevo

        var user = new User{
            Email= dto.Email,
            PasswordHash = passwordHash,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;

    }

    public async Task<User> LoginAsync(LoginDto dto)
    {
        // Buscar usuario por email
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
        {
            throw new UnauthorizedAccessException("Credenciales inválidas");
        }

        // Verificamos la contraseña
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!isPasswordValid)
        {
            throw new UnauthorizedAccessException("Credenciales inválidas");
        }

        return user;
    }

    public string GenerateJwtToken(User user){
        var jwtKey = _configuration["Jwt:key"] ?? throw new InvalidOperationException("JWT Key no configurada");
        var jwtIssuer = _configuration["Jwt:Issuer"] ?? "MovieApi";
        var jwtAudience = _configuration["Jwt:Audience"] ?? "MovieClient";
        var expiresInMinutes = int.Parse(_configuration["Jwt:ExpiresInMinutes"] ?? "60");
    
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresInMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);

    }



}