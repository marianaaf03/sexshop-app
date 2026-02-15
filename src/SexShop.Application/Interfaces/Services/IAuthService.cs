using SexShop.Application.Common;
using SexShop.Application.DTOs;
using System.Threading.Tasks;

namespace SexShop.Application.Interfaces.Services;

public interface IAuthService
{
    Task<ApiResponse<TokenDto>> LoginAsync(LoginDto loginDto);
    Task<ApiResponse<bool>> RegisterAsync(RegisterDto registerDto, string role = "Guest");
}
