using Microsoft.AspNetCore.Mvc;
using SexShop.Application.Common;
using SexShop.Application.DTOs;
using SexShop.Application.Interfaces.Services;

namespace SexShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<TokenDto>>> Login(LoginDto loginDto)
    {
        var result = await _authService.LoginAsync(loginDto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<bool>>> Register(RegisterDto registerDto)
    {
        var result = await _authService.RegisterAsync(registerDto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("seed-admin")]
    public async Task<ActionResult<ApiResponse<bool>>> SeedAdmin()
    {
        var registerDto = new RegisterDto
        {
            Email = "admin@sexshop.com",
            Password = "AdminPassword123!",
            Nombre = "Administrator",
            Apellido = "System"
        };
        var result = await _authService.RegisterAsync(registerDto, "Admin");
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }
}
