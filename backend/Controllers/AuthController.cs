using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase{

    private readonly IAuthService _authService;

    public AuthController(IAuthService authService){
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto){
        try{
            
            var user = await _authService.RegisterAsync(dto);
            var token = _authService.GenerateJwtToken(user);
            return Ok(new {
                message     = "Usuario registrado exitosamente",
                name        = user.Name,
                email       = user.Email,
                token       = token,
                createdAt   = user.CreatedAt
            });

        } catch(InvalidOperationException ex){
            
            return BadRequest(new { error = ex.Message});
        
        } catch (Exception ex){
            
            return StatusCode(500, new { error = "Error interno del servidor", details = ex.Message });
        
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        try
        {
            var user = await _authService.LoginAsync(dto);
            var token = _authService.GenerateJwtToken(user);
            
            return Ok(new
            {
                message = "Login exitoso",
                email = user.Email,
                name= user.Name,
                token = token
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Error interno del servidor", details = ex.Message });
        }
    }

}