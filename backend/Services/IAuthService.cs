using backend.DTOs;
using backend.Models;

namespace backend.Services;

public interface IAuthService {

    Task<User> RegisterAsync(RegisterDto dto);
    Task<User> LoginAsync(LoginDto dto);
    string GenerateJwtToken(User user);

}