namespace ContasMensais.Api.DTOs
{
    public class YoyDto
    {
        public int Ano { get; set; }
        public int Mes { get; set; }

        public decimal TotalAtual { get; set; }
        public decimal TotalAnoAnterior { get; set; }

        public decimal? YoyPercentual { get; set; }
    }
}