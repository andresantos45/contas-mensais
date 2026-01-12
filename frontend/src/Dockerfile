# ================= FRONTEND BUILD =================
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# ================= BACKEND BUILD ==================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /app
COPY ContasMensais.Api ./ContasMensais.Api
RUN dotnet restore ContasMensais.Api
RUN dotnet publish ContasMensais.Api -c Release -o /app/publish

# ================= RUNTIME ========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=backend-build /app/publish .
COPY --from=frontend-build /app/frontend/dist ./wwwroot

ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "ContasMensais.Api.dll"]