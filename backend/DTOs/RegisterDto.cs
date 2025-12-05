using System.ComponentModel.DataAnnotations;
namespace backend.DTOs;

public class RegisterDto {

    [Required(ErrorMessage = "El nombre es obligarorio.")]
    public string Name {get ; set;} = string.Empty;
    
    [Required(ErrorMessage = "El email es obligarorio.")]
    [EmailAddress(ErrorMessage = "El formato del email no es valido")]
    [MaxLength(35,ErrorMessage = "El email es demasiado largo el limite es 35 caracteres")]
    public string Email {get ; set;} = string.Empty;

    [Required(ErrorMessage = "La contraseña es obligatoria.")]
    [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
    public string Password {get ; set;} = string.Empty;
}