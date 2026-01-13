using System;

namespace ContasMensais.Api.Models
{
    public class Conta
    {
        public int Id { get; set; }

        public string Descricao { get; set; } = string.Empty;

        public decimal Valor { get; set; }

        public DateTime Data { get; set; }

        // 🔗 Categoria
        public int CategoriaId { get; set; }
        public Categoria? Categoria { get; set; }

        // 🔐 Usuário dono da conta
        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }
    }
}