# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiamos todo lo que Render mande como contexto
COPY . .

# Diagnóstico: Listar archivos para ver dónde estamos exactamente
RUN ls -R

# Intentamos restaurar buscando el archivo .sln esté donde esté
# Esto encontrará "src/SexShop.sln" o "SexShop.sln" independientemente del contexto
RUN dotnet restore $(find . -name "*.sln" | head -n 1)

# Publicamos el proyecto API buscando su archivo .csproj
RUN dotnet publish $(find . -name "SexShop.API.csproj" | head -n 1) -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "SexShop.API.dll"]
