using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContasMensais.Api.Models
{
    [Table("usuarios")]
    public class Usuario
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("senha_hash")]
        public string SenhaHash { get; set; } = string.Empty;

        [Column("criado_em")]
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    }
}