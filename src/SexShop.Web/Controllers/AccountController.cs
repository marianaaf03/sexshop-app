using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using SexShop.Application.DTOs;
using SexShop.Web.Services;
using System.Security.Claims;

namespace SexShop.Web.Controllers;

public class AccountController : Controller
{
    private readonly IWebAuthService _authService;

    public AccountController(IWebAuthService authService)
    {
        _authService = authService;
    }

    [HttpGet]
    public IActionResult Login() => View();

    [HttpPost]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var result = await _authService.LoginAsync(loginDto);
        if (result.Success && result.Data != null)
        {
            await SignInUser(result.Data);

            // Redirection based on Role
            if (result.Data.Roles.Contains("Admin"))
            {
                return RedirectToAction("Dashboard", "Admin");
            }

            return RedirectToAction("Index", "Home");
        }

        ModelState.AddModelError("", result.Message);
        return View(loginDto);
    }

    [HttpGet]
    public IActionResult Register() => View();

    [HttpPost]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
        var result = await _authService.RegisterAsync(registerDto);
        if (result.Success)
        {
            // Auto-Login after Registration
            var loginResult = await _authService.LoginAsync(new LoginDto 
            { 
                Email = registerDto.Email, 
                Password = registerDto.Password 
            });

            if (loginResult.Success && loginResult.Data != null)
            {
                await SignInUser(loginResult.Data);
                return RedirectToAction("Index", "Home");
            }

            return RedirectToAction("Login");
        }

        ModelState.AddModelError("", result.Message);
        return View(registerDto);
    }

    private async Task SignInUser(TokenDto tokenDto)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, tokenDto.Nombre),
            new Claim(ClaimTypes.Email, tokenDto.Email),
            new Claim("Token", tokenDto.Token)
        };

        foreach (var role in tokenDto.Roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var identity = new ClaimsIdentity(claims, "Cookies");
        var principal = new ClaimsPrincipal(identity);

        await HttpContext.SignInAsync("Cookies", principal);
    }

    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync("Cookies");
        return RedirectToAction("Index", "Home");
    }

    public IActionResult AccessDenied() => View();
}
