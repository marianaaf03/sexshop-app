# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiamos todo el contenido del repositorio (un nivel arriba de src/SexShop.API)
COPY . ./

# Restaurar dependencias usando el archivo de solución o el proyecto principal
# Al estar en la raíz, podemos usar las rutas relativas correctamente
RUN dotnet restore src/SexShop.API/SexShop.API.csproj

# Publicar el proyecto
RUN dotnet publish src/SexShop.API/SexShop.API.csproj -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out ./

# Configuración de puerto para Render
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "SexShop.API.dll"]
