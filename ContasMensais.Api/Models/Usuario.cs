using System.ComponentModel.DataAnnotations.Schema;

namespace ContasMensais.Api.Models
{
    public class Usuario
    {
        public int Id { get; set; }

        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("senha_hash")]
        public string SenhaHash { get; set; } = string.Empty;
        [Column("role")]
        public string Role { get; set; } = string.Empty;

        [Column("criado_em")]
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    }
}