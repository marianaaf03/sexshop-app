using Microsoft.AspNetCore.Identity;
using SexShop.Application.Common;
using SexShop.Application.DTOs;
using SexShop.Application.Interfaces.Services;
using SexShop.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SexShop.Application.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IJwtService _jwtService;

    public AuthService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IJwtService jwtService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _jwtService = jwtService;
    }

    public async Task<ApiResponse<TokenDto>> LoginAsync(LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
        {
            return ApiResponse<TokenDto>.FailureResponse("Invalid email or password");
        }

        var roles = await _userManager.GetRolesAsync(user);
        var token = _jwtService.GenerateToken(user, roles);

        return ApiResponse<TokenDto>.SuccessResponse(new TokenDto
        {
            Token = token,
            Email = user.Email!,
            Nombre = user.Nombre,
            Roles = roles
        }, "Login successful");
    }

    public async Task<ApiResponse<bool>> RegisterAsync(RegisterDto registerDto, string role = "Guest")
    {
        var userExists = await _userManager.FindByEmailAsync(registerDto.Email);
        if (userExists != null)
        {
            return ApiResponse<bool>.FailureResponse("User already exists");
        }

        var user = new ApplicationUser
        {
            UserName = registerDto.Email,
            Email = registerDto.Email,
            Nombre = registerDto.Nombre,
            Apellido = registerDto.Apellido,
            SecurityStamp = Guid.NewGuid().ToString()
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            return ApiResponse<bool>.FailureResponse("User creation failed", result.Errors.Select(e => e.Description).ToList());
        }

        if (!await _roleManager.RoleExistsAsync(role))
        {
            await _roleManager.CreateAsync(new IdentityRole(role));
        }

        await _userManager.AddToRoleAsync(user, role);

        return ApiResponse<bool>.SuccessResponse(true, "User registered successfully");
    }
}
