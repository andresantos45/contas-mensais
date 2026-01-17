# =========================
# BUILD
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore ContasMensais.Api.csproj
RUN dotnet publish ContasMensais.Api.csproj -c Release -o /app/publish

# =========================
# RUNTIME
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "ContasMensais.Api.dll"]