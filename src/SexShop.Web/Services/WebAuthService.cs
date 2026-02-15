using SexShop.Application.Common;
using SexShop.Application.DTOs;

namespace SexShop.Web.Services;

public interface IWebAuthService
{
    Task<ApiResponse<TokenDto>> LoginAsync(LoginDto loginDto);
    Task<ApiResponse<bool>> RegisterAsync(RegisterDto registerDto);
}

public class WebAuthService : IWebAuthService
{
    private readonly IApiClient _apiClient;

    public WebAuthService(IApiClient apiClient)
    {
        _apiClient = apiClient;
    }

    public async Task<ApiResponse<TokenDto>> LoginAsync(LoginDto loginDto)
    {
        return await _apiClient.PostAsync<TokenDto>("api/auth/login", loginDto);
    }

    public async Task<ApiResponse<bool>> RegisterAsync(RegisterDto registerDto)
    {
        return await _apiClient.PostAsync<bool>("api/auth/register", registerDto);
    }
}
