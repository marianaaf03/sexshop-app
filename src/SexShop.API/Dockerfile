# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiamos TODO el repositorio (Render usa la raíz como contexto)
COPY . .

# Usamos rutas completas desde la raíz para evitar errores de directorio
RUN dotnet restore "src/SexShop.API/SexShop.API.csproj"

# Publicamos el proyecto en una carpeta de salida limpia
RUN dotnet publish "src/SexShop.API/SexShop.API.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copiamos solo los archivos publicados
COPY --from=build /app/publish .

# Configuración para Render
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "SexShop.API.dll"]
