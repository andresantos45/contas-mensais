using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContasMensais.Api.Models
{
    [Table("categorias")]
    public class Categoria
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        // 🔐 DONO DA CATEGORIA
        [Column("Usuarioid")]
public int UsuarioId { get; set; }

[ForeignKey(nameof(UsuarioId))]
public Usuario Usuario { get; set; } = null!;
    }
}
