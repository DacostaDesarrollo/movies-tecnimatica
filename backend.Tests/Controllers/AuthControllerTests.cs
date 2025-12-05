using backend.Controllers;
using backend.DTOs;
using backend.Models;
using backend.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace backend.Tests.Controllers;

/// <summary>
/// 🧪 UNIT TESTS PARA AuthController
/// 
/// Los tests de controladores verifican:
/// 1. Que se llaman los servicios correctos
/// 2. Que se retornan los códigos HTTP apropiados
/// 3. Que se manejan las excepciones correctamente
/// 4. Que los datos de respuesta son correctos
/// 
/// Usamos Moq para simular IAuthService sin necesidad de DB real
/// </summary>
public class AuthControllerTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _controller = new AuthController(_authServiceMock.Object);
    }

    #region Register Tests

    [Fact]
    public async Task Register_WithValidData_ShouldReturn200WithToken()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Email = "newuser@example.com",
            Password = "Password123!"
        };

        var mockUser = new User
        {
            Id = 1,
            Name = "Test User",
            Email = registerDto.Email,
            PasswordHash = "hashed",
            CreatedAt = DateTime.UtcNow
        };

        var mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token";

        // Configurar mocks
        _authServiceMock
            .Setup(s => s.RegisterAsync(It.IsAny<RegisterDto>()))
            .ReturnsAsync(mockUser);

        _authServiceMock
            .Setup(s => s.GenerateJwtToken(It.IsAny<User>()))
            .Returns(mockToken);

        // Act
        var result = await _controller.Register(registerDto);

        // Assert
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.StatusCode.Should().Be(200);

        var response = okResult.Value;
        response.Should().NotBeNull();

        // Verificar que se llamaron los métodos del servicio
        _authServiceMock.Verify(s => s.RegisterAsync(registerDto), Times.Once);
        _authServiceMock.Verify(s => s.GenerateJwtToken(mockUser), Times.Once);
    }

    [Fact]
    public async Task Register_WithExistingEmail_ShouldReturn400()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Email = "existing@example.com",
            Password = "Password123!"
        };

        _authServiceMock
            .Setup(s => s.RegisterAsync(It.IsAny<RegisterDto>()))
            .ThrowsAsync(new InvalidOperationException("El Email ya esta Registrado!"));

        // Act
        var result = await _controller.Register(registerDto);

        // Assert
        var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
        badRequestResult.StatusCode.Should().Be(400);

        var response = badRequestResult.Value;
        response.Should().NotBeNull();
        var errorProp = response!.GetType().GetProperty("error");
        var errorMessage = errorProp?.GetValue(response) as string;
        errorMessage.Should().Be("El Email ya esta Registrado!");
    }

    [Fact]
    public async Task Register_WithUnexpectedException_ShouldReturn500()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Email = "test@example.com",
            Password = "Password123!"
        };

        _authServiceMock
            .Setup(s => s.RegisterAsync(It.IsAny<RegisterDto>()))
            .ThrowsAsync(new Exception("Database connection failed"));

        // Act
        var result = await _controller.Register(registerDto);

        // Assert
        var statusCodeResult = result.Should().BeOfType<ObjectResult>().Subject;
        statusCodeResult.StatusCode.Should().Be(500);

        var response = statusCodeResult.Value;
        response.Should().NotBeNull();
        var errorProp = response!.GetType().GetProperty("error");
        var errorMessage = errorProp?.GetValue(response) as string;
        errorMessage.Should().Be("Error interno del servidor");
    }

    #endregion

    #region Login Tests

    [Fact]
    public async Task Login_WithValidCredentials_ShouldReturn200WithToken()
    {
        // Arrange
        var loginDto = new LoginDto
        {
            Email = "user@example.com",
            Password = "Password123!"
        };

        var mockUser = new User
        {
            Id = 1,
            Name = "Test User",
            Email = loginDto.Email,
            PasswordHash = "hashed",
            CreatedAt = DateTime.UtcNow
        };

        var mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token";

        _authServiceMock
            .Setup(s => s.LoginAsync(It.IsAny<LoginDto>()))
            .ReturnsAsync(mockUser);

        _authServiceMock
            .Setup(s => s.GenerateJwtToken(It.IsAny<User>()))
            .Returns(mockToken);

        // Act
        var result = await _controller.Login(loginDto);

        // Assert
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.StatusCode.Should().Be(200);

        var response = okResult.Value;
        response.Should().NotBeNull();

        // Verificar llamadas
        _authServiceMock.Verify(s => s.LoginAsync(loginDto), Times.Once);
        _authServiceMock.Verify(s => s.GenerateJwtToken(mockUser), Times.Once);
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ShouldReturn401()
    {
        // Arrange
        var loginDto = new LoginDto
        {
            Email = "user@example.com",
            Password = "WrongPassword"
        };

        _authServiceMock
            .Setup(s => s.LoginAsync(It.IsAny<LoginDto>()))
            .ThrowsAsync(new UnauthorizedAccessException("Credenciales inválidas"));

        // Act
        var result = await _controller.Login(loginDto);

        // Assert
        var unauthorizedResult = result.Should().BeOfType<UnauthorizedObjectResult>().Subject;
        unauthorizedResult.StatusCode.Should().Be(401);

        var response = unauthorizedResult.Value;
        response.Should().NotBeNull();
        var errorProp = response!.GetType().GetProperty("error");
        var errorMessage = errorProp?.GetValue(response) as string;
        errorMessage.Should().Be("Credenciales inválidas");
    }

    [Fact]
    public async Task Login_WithUnexpectedException_ShouldReturn500()
    {
        // Arrange
        var loginDto = new LoginDto
        {
            Email = "user@example.com",
            Password = "Password123!"
        };

        _authServiceMock
            .Setup(s => s.LoginAsync(It.IsAny<LoginDto>()))
            .ThrowsAsync(new Exception("Database timeout"));

        // Act
        var result = await _controller.Login(loginDto);

        // Assert
        var statusCodeResult = result.Should().BeOfType<ObjectResult>().Subject;
        statusCodeResult.StatusCode.Should().Be(500);
    }

    #endregion

    #region Mock Verification Tests

    [Fact]
    public async Task Register_ShouldCallGenerateJwtTokenWithCorrectUser()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Email = "test@example.com",
            Password = "Password123!"
        };

        var expectedUser = new User
        {
            Id = 99,
            Name = "Test User",
            Email = "test@example.com",
            PasswordHash = "hashed",
            CreatedAt = DateTime.UtcNow
        };

        _authServiceMock
            .Setup(s => s.RegisterAsync(It.IsAny<RegisterDto>()))
            .ReturnsAsync(expectedUser);

        _authServiceMock
            .Setup(s => s.GenerateJwtToken(It.IsAny<User>()))
            .Returns("token");

        // Act
        await _controller.Register(registerDto);

        // Assert
        _authServiceMock.Verify(
            s => s.GenerateJwtToken(It.Is<User>(u => u.Id == 99 && u.Email == "test@example.com")),
            Times.Once
        );
    }

    #endregion
}
