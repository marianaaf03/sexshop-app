# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# Copy everything and restore
COPY . .
RUN dotnet restore "src/SexShop.Web/SexShop.Web.csproj"

# Build and publish
RUN dotnet publish "src/SexShop.Web/SexShop.Web.csproj" -c Release -o /app/publish

# Final Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

# Environment variables
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "SexShop.Web.dll"]
