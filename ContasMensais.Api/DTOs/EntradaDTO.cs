    using System;

namespace ContasMensais.Api.DTOs
{
    public class EntradaDTO
    {
        public string Descricao { get; set; } = null!;
        public decimal Valor { get; set; }
        public DateTime Data { get; set; }
        public int CategoriaId { get; set; }
    }
}