using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContasMensais.Api.Migrations
{
    public partial class AddUsuarioToCategorias : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Usuarioid",
                schema: "public",
                table: "categorias",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_categorias_Usuarioid",
                schema: "public",
                table: "categorias",
                column: "Usuarioid");

            migrationBuilder.AddForeignKey(
                name: "FK_categorias_usuarios_Usuarioid",
                schema: "public",
                table: "categorias",
                column: "Usuarioid",
                principalSchema: "public",
                principalTable: "usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_categorias_usuarios_Usuarioid",
                schema: "public",
                table: "categorias");

            migrationBuilder.DropIndex(
                name: "IX_categorias_Usuarioid",
                schema: "public",
                table: "categorias");

            migrationBuilder.DropColumn(
                name: "Usuarioid",
                schema: "public",
                table: "categorias");
        }
    }
}
