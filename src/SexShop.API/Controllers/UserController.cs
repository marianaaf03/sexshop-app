using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SexShop.Application.Common;
using SexShop.Application.DTOs;
using SexShop.Domain.Entities;

namespace SexShop.API.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserDto>>>> GetAll()
    {
        var users = _userManager.Users.ToList();
        var dtos = users.Select(u => new UserDto
        {
            Id = u.Id,
            Email = u.Email!,
            Nombre = u.Nombre,
            Apellido = u.Apellido,
            FechaRegistro = u.FechaRegistro
        });
        return Ok(ApiResponse<IEnumerable<UserDto>>.SuccessResponse(dtos));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(ApiResponse<bool>.FailureResponse("User not found"));
        await _userManager.DeleteAsync(user);
        return Ok(ApiResponse<bool>.SuccessResponse(true, "User deleted"));
    }
}
