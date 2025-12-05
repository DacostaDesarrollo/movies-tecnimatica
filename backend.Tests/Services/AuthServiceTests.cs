using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace backend.Tests.Services;

/// <summary>
/// 🧪 UNIT TESTS PARA AuthService
/// 
/// Conceptos clave:
/// - InMemory Database: Base de datos temporal en memoria para testing
/// - Moq: Framework para crear mocks de dependencias
/// - FluentAssertions: Librería para assertions más legibles
/// - xUnit: Framework de testing para .NET
/// 
/// Patrón AAA:
/// - Arrange: Preparar datos y mocks
/// - Act: Ejecutar el método a testear
/// - Assert: Verificar el resultado
/// </summary>
public class AuthServiceTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        // Configurar InMemory Database
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // DB única por test
            .Options;

        _context = new AppDbContext(options);

        // Mock de IConfiguration para JWT
        var configData = new Dictionary<string, string>
        {
            {"Jwt:Key", "super-secret-key-for-testing-at-least-32-characters-long"},
            {"Jwt:Issuer", "TestIssuer"},
            {"Jwt:Audience", "TestAudience"},
            {"Jwt:ExpiresInMinutes", "60"}
        };

        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configData!)
            .Build();

        _authService = new AuthService(_context, _configuration);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    #region RegisterAsync Tests

    [Fact]
    public async Task RegisterAsync_WithValidData_ShouldCreateUser()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Name = "New User",
            Email = "newuser@example.com",
            Password = "Password123!"
        };

        // Act
        var result = await _authService.RegisterAsync(registerDto);

        // Assert
        result.Should().NotBeNull();
        result.Email.Should().Be(registerDto.Email);
        result.PasswordHash.Should().NotBeNullOrEmpty();
        result.Id.Should().BeGreaterThan(0);
        result.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));

        // Verificar que se guardó en la base de datos
        var userInDb = await _context.Users.FindAsync(result.Id);
        userInDb.Should().NotBeNull();
        userInDb!.Email.Should().Be(registerDto.Email);
    }

    [Fact]
    public async Task RegisterAsync_WithExistingEmail_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var existingUser = new User
        {
            Name = "Existing User",
            Email = "existing@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
            CreatedAt = DateTime.UtcNow
        };
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();

        var registerDto = new RegisterDto
        {
            Name = "New User",
            Email = "existing@example.com",
            Password = "NewPassword123!"
        };

        // Act
        Func<Task> act = async () => await _authService.RegisterAsync(registerDto);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("El Email ya esta Registrado!");
    }

    [Fact]
    public async Task RegisterAsync_ShouldHashPassword()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Name = "Test User",
            Email = "test@example.com",
            Password = "PlainTextPassword123!"
        };

        // Act
        var result = await _authService.RegisterAsync(registerDto);

        // Assert
        result.PasswordHash.Should().NotBe(registerDto.Password);
        BCrypt.Net.BCrypt.Verify(registerDto.Password, result.PasswordHash).Should().BeTrue();
    }

    #endregion

    #region LoginAsync Tests

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ShouldReturnUser()
    {
        // Arrange
        var password = "Password123!";
        var user = new User
        {
            Name = "Test User",
            Email = "user@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            CreatedAt = DateTime.UtcNow
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var loginDto = new LoginDto
        {
            Email = "user@example.com",
            Password = password
        };

        // Act
        var result = await _authService.LoginAsync(loginDto);

        // Assert
        result.Should().NotBeNull();
        result.Email.Should().Be(loginDto.Email);
        result.Id.Should().Be(user.Id);
    }

    [Fact]
    public async Task LoginAsync_WithInvalidEmail_ShouldThrowUnauthorizedAccessException()
    {
        // Arrange
        var loginDto = new LoginDto
        {
            Email = "nonexistent@example.com",
            Password = "Password123!"
        };

        // Act
        Func<Task> act = async () => await _authService.LoginAsync(loginDto);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Credenciales inválidas");
    }

    [Fact]
    public async Task LoginAsync_WithInvalidPassword_ShouldThrowUnauthorizedAccessException()
    {
        // Arrange
        var user = new User
        {
            Name = "Test User",
            Email = "user@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword123!"),
            CreatedAt = DateTime.UtcNow
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var loginDto = new LoginDto
        {
            Email = "user@example.com",
            Password = "WrongPassword123!"
        };

        // Act
        Func<Task> act = async () => await _authService.LoginAsync(loginDto);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Credenciales inválidas");
    }

    #endregion

    #region GenerateJwtToken Tests

    [Fact]
    public void GenerateJwtToken_ShouldReturnValidToken()
    {
        // Arrange
        var user = new User
        {
            Id = 1,
            Name = "Test User",
            Email = "user@example.com",
            PasswordHash = "hashed",
            CreatedAt = DateTime.UtcNow
        };

        // Act
        var token = _authService.GenerateJwtToken(user);

        // Assert
        token.Should().NotBeNullOrEmpty();
        token.Should().Contain("."); // JWT tiene 3 partes separadas por puntos
        token.Split('.').Should().HaveCount(3);
    }

    [Fact]
    public void GenerateJwtToken_ShouldContainUserClaims()
    {
        // Arrange
        var user = new User
        {
            Id = 42,
            Name = "Test User",
            Email = "test@example.com",
            PasswordHash = "hashed",
            CreatedAt = DateTime.UtcNow
        };

        // Act
        var token = _authService.GenerateJwtToken(user);

        // Assert
        // Decodificamos el token para verificar claims
        var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);

        jwtToken.Claims.Should().Contain(c => c.Type == "sub" && c.Value == "42");
        jwtToken.Claims.Should().Contain(c => c.Type == "email" && c.Value == "test@example.com");
        jwtToken.Claims.Should().Contain(c => c.Type == "jti"); // JTI siempre presente
    }

    [Fact]
    public void GenerateJwtToken_ShouldSetCorrectExpiration()
    {
        // Arrange
        var user = new User
        {
            Id = 1,
            Name = "Test User",
            Email = "user@example.com",
            PasswordHash = "hashed",
            CreatedAt = DateTime.UtcNow
        };

        // Act
        var token = _authService.GenerateJwtToken(user);

        // Assert
        var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);

        var expectedExpiration = DateTime.UtcNow.AddMinutes(60);
        jwtToken.ValidTo.Should().BeCloseTo(expectedExpiration, TimeSpan.FromSeconds(10));
    }

    #endregion

    #region Integration Tests

    [Fact]
    public async Task FullAuthFlow_RegisterThenLogin_ShouldSucceed()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Email = "fullflow@example.com",
            Password = "Password123!"
        };

        // Act 1: Register
        var registeredUser = await _authService.RegisterAsync(registerDto);
        registeredUser.Should().NotBeNull();

        // Act 2: Login with same credentials
        var loginDto = new LoginDto
        {
            Email = registerDto.Email,
            Password = registerDto.Password
        };
        var loggedInUser = await _authService.LoginAsync(loginDto);

        // Assert
        loggedInUser.Should().NotBeNull();
        loggedInUser.Email.Should().Be(registeredUser.Email);
        loggedInUser.Id.Should().Be(registeredUser.Id);

        // Act 3: Generate token
        var token = _authService.GenerateJwtToken(loggedInUser);
        token.Should().NotBeNullOrEmpty();
    }

    #endregion
}
