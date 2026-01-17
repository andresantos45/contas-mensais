using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ContasMensais.Api.Data;
using ContasMensais.Api.Models;
using Microsoft.EntityFrameworkCore;
using ContasMensais.Api.Services;

var builder = WebApplication.CreateBuilder(args);
// 🔐 CHAVE JWT CENTRALIZADA (ÚNICO PONTO DA CHAVE)
var jwtKey = builder.Configuration["JWT_KEY"]
             ?? "CHAVE_SUPER_SECRETA_MIN_32_CARACTERES_123!";

// 🔹 PORTA DO RENDER (OBRIGATÓRIO)
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Controllers
builder.Services.AddControllers();

// 🔎 OBRIGATÓRIO PARA O SWAGGER FUNCIONAR CORRETAMENTE
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddScoped<DashboardService>();

// =========================
// JWT AUTHENTICATION
// =========================
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            )
        };
    });
// 🔐 AUTHORIZATION (SEM ISSO O AUTHORIZE NÃO APARECE)
builder.Services.AddAuthorization();
// Entity Framework + SQLite
// Entity Framework + PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString =
        builder.Configuration.GetConnectionString("DefaultConnection")
        ?? Environment.GetEnvironmentVariable("DATABASE_URL");

    options.UseNpgsql(connectionString);
});

// Swagger
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "ContasMensais.Api",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
{
    Name = "Authorization",
    Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
    Scheme = "bearer",
    BearerFormat = "JWT",
    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
    Description = "Digite: Bearer {seu_token}"
});

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// CORS (FRONTEND LOCAL + PRODUÇÃO)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://contas-mensais-frontend.onrender.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();


// Middlewares
app.UseCors("AllowFrontend");

// Swagger (OBRIGATÓRIO)
app.UseSwagger();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "ContasMensais.Api v1");
    options.RoutePrefix = "swagger";
});

app.UseAuthentication();
app.UseAuthorization();

// Endpoints obrigatórios Render
app.MapGet("/", () => "API Contas Mensais rodando no Render 🚀");
app.MapGet("/health", () => Results.Ok("healthy"));

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    context.Database.Migrate();

    // ✅ LISTA OFICIAL DE CATEGORIAS PADRÃO
    var categoriasPadrao = new[]
    {
        "Alimentação",
        "Moradia",
        "Transporte",
        "Saúde",
        "Lazer",
        "Educação",
        "Outros"
    };

    // 🧹 REMOVE CATEGORIAS QUE NÃO SÃO PADRÃO
    var categoriasInvalidas = context.Categorias
        .Where(c => !categoriasPadrao.Contains(c.Nome))
        .ToList();

    if (categoriasInvalidas.Any())
    {
        context.Categorias.RemoveRange(categoriasInvalidas);
    }

    // ➕ GARANTE QUE TODAS AS PADRÃO EXISTAM (SEM DUPLICAR)
    foreach (var nome in categoriasPadrao)
    {
        if (!context.Categorias.Any(c => c.Nome == nome))
        {
            context.Categorias.Add(new Categoria { Nome = nome });
        }
    }

    context.SaveChanges();
}


app.Run();