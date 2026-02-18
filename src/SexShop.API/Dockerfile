# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# NOTA: En Render, el contexto de construcción es la RAÍZ del repositorio.
# Por lo tanto, aunque este archivo esté en src/SexShop.API, el comando COPY . . 
# copiará todo lo que Render le mande (la raíz).

COPY . ./

# Restauramos el proyecto principal (la ruta es relativa a la raíz)
RUN dotnet restore src/SexShop.API/SexShop.API.csproj

# Publicamos el proyecto
RUN dotnet publish src/SexShop.API/SexShop.API.csproj -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out ./

# Configuración de puerto para Render
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "SexShop.API.dll"]
