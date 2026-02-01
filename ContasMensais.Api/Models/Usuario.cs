using System.ComponentModel.DataAnnotations.Schema;

public class Usuario
{
    public int Id { get; set; }

    public string Nome { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string SenhaHash { get; set; } = string.Empty;

    public string Role { get; set; } = "user";

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    // 🔐 MAPEAMENTO CORRETO
    [Column("refresh_token")]
    public string? RefreshToken { get; set; }

    [Column("refresh_token_expira_em")]
    public DateTime? RefreshTokenExpiraEm { get; set; }
}
