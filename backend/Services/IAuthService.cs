using backend.DTOs;
using backend.Models;

namespace backend.Services;

public interface IAuthService {

    Task<User> RegisterAsync(RegisterDto dto);
    string GenerateJwtToken(User user);

}