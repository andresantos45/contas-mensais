using System.ComponentModel.DataAnnotations;

namespace ContasMensais.Api.DTOs
{
    public class RegisterDto
    {
       
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Senha { get; set; } = string.Empty;
    }
}