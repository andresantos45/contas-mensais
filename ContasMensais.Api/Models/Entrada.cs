namespace ContasMensais.Api.Models
{
    public class Entrada
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public DateTime Data { get; set; }

        public int Mes { get; set; }
        public int Ano { get; set; }

        public int CategoriaId { get; set; }
        public string CategoriaNome { get; set; } = string.Empty;

        // 🔐 DONO DA ENTRADA
        public int UsuarioId { get; set; }
    }
}