# 🧪 Testing Backend - .NET 8

Proyecto de pruebas unitarias para el backend de Movies Tecnimatica.

## 📋 Stack de Testing

- **xUnit 2.5.3** - Framework de testing para .NET
- **Moq 4.20.72** - Librería para crear mocks
- **FluentAssertions 8.8.0** - Assertions legibles y expresivas
- **EF Core InMemory 8.0.4** - Base de datos en memoria para tests
- **coverlet.collector** - Generación de cobertura de código

## 🚀 Ejecutar Pruebas

### Ejecutar todos los tests

```bash
cd backend.Tests
dotnet test
```

### Ejecutar con verbosidad mínima

```bash
dotnet test --verbosity minimal
```

### Ejecutar con cobertura de código

```bash
dotnet test --collect:"XPlat Code Coverage"
```

### Ver cobertura en formato HTML (requiere ReportGenerator)

```bash
# Instalar ReportGenerator globalmente (solo una vez)
dotnet tool install -g dotnet-reportgenerator-globaltool

# Generar reporte
dotnet test --collect:"XPlat Code Coverage"
reportgenerator -reports:"**/coverage.cobertura.xml" -targetdir:"coveragereport" -reporttypes:Html

# Abrir reporte (Linux)
xdg-open coveragereport/index.html
```

## 📊 Cobertura Actual

```
✅ AuthServiceTests:    13 tests passing
✅ AuthControllerTests:  4 tests passing
-------------------------------------------
Total:                  17 tests ✅
```

## 🧪 Tests Implementados

### AuthService Tests

#### ✅ RegisterAsync
- `RegisterAsync_WithValidData_ShouldCreateUser`
- `RegisterAsync_WithExistingEmail_ShouldThrowInvalidOperationException`
- `RegisterAsync_ShouldHashPassword`

#### ✅ LoginAsync
- `LoginAsync_WithValidCredentials_ShouldReturnUser`
- `LoginAsync_WithInvalidEmail_ShouldThrowUnauthorizedAccessException`
- `LoginAsync_WithInvalidPassword_ShouldThrowUnauthorizedAccessException`

#### ✅ GenerateJwtToken
- `GenerateJwtToken_ShouldReturnValidToken`
- `GenerateJwtToken_ShouldContainUserClaims`
- `GenerateJwtToken_ShouldSetCorrectExpiration`

#### ✅ Integration Tests
- `FullAuthFlow_RegisterThenLogin_ShouldSucceed`

### AuthController Tests

#### ✅ Register Endpoint
- `Register_WithValidData_ShouldReturn200WithToken`
- `Register_WithExistingEmail_ShouldReturn400`
- `Register_WithUnexpectedException_ShouldReturn500`

#### ✅ Login Endpoint
- `Login_WithValidCredentials_ShouldReturn200WithToken`
- `Login_WithInvalidCredentials_ShouldReturn401`
- `Login_WithUnexpectedException_ShouldReturn500`

#### ✅ Mock Verification
- `Register_ShouldCallGenerateJwtTokenWithCorrectUser`

## 🏗️ Estructura del Proyecto

```
backend.Tests/
├── Services/
│   └── AuthServiceTests.cs       # Tests del servicio de autenticación
├── Controllers/
│   └── AuthControllerTests.cs    # Tests del controlador de auth
└── backend.Tests.csproj          # Configuración del proyecto
```

## 📝 Patrón AAA (Arrange-Act-Assert)

Todos los tests siguen el patrón AAA:

```csharp
[Fact]
public async Task ExampleTest()
{
    // Arrange: Preparar datos de prueba
    var input = new SomeDto { /* ... */ };
    
    // Act: Ejecutar el método a probar
    var result = await _service.DoSomething(input);
    
    // Assert: Verificar el resultado esperado
    result.Should().NotBeNull();
    result.Value.Should().Be(expectedValue);
}
```

## 🔧 Conceptos Clave

### InMemory Database

Usamos EF Core InMemory para tests que necesitan base de datos:

```csharp
var options = new DbContextOptionsBuilder<AppDbContext>()
    .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
    .Options;
```

### Mocking con Moq

Simulamos dependencias para aislar el código bajo prueba:

```csharp
var mockService = new Mock<IAuthService>();
mockService
    .Setup(s => s.RegisterAsync(It.IsAny<RegisterDto>()))
    .ReturnsAsync(mockUser);
```

### FluentAssertions

Assertions legibles y expresivas:

```csharp
result.Should().NotBeNull();
result.Email.Should().Be("test@example.com");
result.PasswordHash.Should().NotBeNullOrEmpty();
```

## 🎯 Mejoras Futuras

- [ ] Tests para `FavoriteService`
- [ ] Tests para `OmdbService`
- [ ] Tests para `MoviesController`
- [ ] Aumentar cobertura de código >80%
- [ ] Tests de integración con base de datos real (TestContainers)
- [ ] Tests de rendimiento/carga

## 📚 Recursos

- [xUnit Documentation](https://xunit.net/)
- [Moq Quick Start](https://github.com/moq/moq4/wiki/Quickstart)
- [FluentAssertions](https://fluentassertions.com/)
- [EF Core Testing](https://learn.microsoft.com/en-us/ef/core/testing/)
