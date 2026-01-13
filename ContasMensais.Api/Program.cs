using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ContasMensais.Api.Data;
using ContasMensais.Api.Models;
using Microsoft.EntityFrameworkCore;
using ContasMensais.Api.Services;

var builder = WebApplication.CreateBuilder(args);

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
                Encoding.UTF8.GetBytes("CHAVE_SUPER_SECRETA_MIN_32_CARACTERES_123!")
            )
        };
    });
// 🔐 AUTHORIZATION (SEM ISSO O AUTHORIZE NÃO APARECE)
builder.Services.AddAuthorization();
// Entity Framework + SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite("Data Source=contas.db");
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
                "https://contas-mensais-q4z8.onrender.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// 🔴 GARANTIR QUE O BANCO E AS TABELAS EXISTEM
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    context.Database.EnsureCreated();

    if (!context.Categorias.Any())
    {
        context.Categorias.AddRange(
            new Categoria { Nome = "Moradia" },
            new Categoria { Nome = "Alimentação" },
            new Categoria { Nome = "Energia" },
            new Categoria { Nome = "Água" },
            new Categoria { Nome = "Internet" },
            new Categoria { Nome = "Outros" }
        );
    }

    if (!context.Usuarios.Any())
    {
        context.Usuarios.Add(new Usuario
        {
            Nome = "Admin",
            Email = "admin@local",
            SenhaHash = "admin"
        });
    }

    context.SaveChanges();
}

// Middlewares
app.UseCors("AllowFrontend");

app.UseSwagger();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "ContasMensais.Api v1");
});

app.UseAuthentication();
app.UseAuthorization();

// Endpoints obrigatórios Render
app.MapGet("/", () => "API Contas Mensais rodando no Render 🚀");
app.MapGet("/health", () => Results.Ok("healthy"));

app.MapControllers();

app.Run();