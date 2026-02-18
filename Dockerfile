# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiamos TODO el repositorio para tener acceso a Infrastructure, Application, etc.
COPY . .

# Restauramos la SOLUCIÓN completa para asegurar que todas las dependencias se encuentren
RUN dotnet restore "src/SexShop.sln"

# Publicamos solo el proyecto API
RUN dotnet publish "src/SexShop.API/SexShop.API.csproj" -c Release -o /app/out --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out ./

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "SexShop.API.dll"]
