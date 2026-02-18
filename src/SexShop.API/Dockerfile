# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiamos todo el contenido del repositorio (contexto raíz)
COPY . .

# Restauramos la SOLUCIÓN completa para asegurar que todas las dependencias se encuentren
RUN dotnet restore "src/SexShop.sln"

# Publicamos solo el proyecto API
RUN dotnet publish "src/SexShop.API/SexShop.API.csproj" -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copiamos los archivos publicados desde la etapa de construcción
COPY --from=build /app/publish .

# Render usa el puerto 8080 por defecto
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "SexShop.API.dll"]
