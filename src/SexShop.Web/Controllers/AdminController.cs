using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SexShop.Application.DTOs;
using SexShop.Web.Services;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using SexShop.Web.ViewModels;

namespace SexShop.Web.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController : Controller
{
    private readonly IWebProductService _productService;
    private readonly IConfiguration _configuration;

    public AdminController(IWebProductService productService, IConfiguration configuration)
    {
        _productService = productService;
        _configuration = configuration;
    }

    public async Task<IActionResult> Dashboard()
    {
        var productsResult = await _productService.GetAllAsync();
        var model = new AdminDashboardViewModel
        {
            TotalProducts = productsResult.Data?.Count() ?? 0,
            TotalUsers = 1, 
            TotalSales = 0
        };
        return View(model);
    }

    public async Task<IActionResult> Products()
    {
        var result = await _productService.GetAllAsync();
        return View(result.Data ?? new List<ProductDto>());
    }

    [HttpGet]
    public IActionResult CreateProduct() => View(new CreateProductDto());

    [HttpPost]
    public async Task<IActionResult> CreateProduct(CreateProductDto dto)
    {
        var token = User.FindFirst("Token")?.Value;
        if (string.IsNullOrEmpty(token)) return RedirectToAction("Login", "Account");

        var result = await _productService.CreateAsync(dto, token);
        if (result.Success) return RedirectToAction("Products");

        ModelState.AddModelError("", result.Message);
        return View(dto);
    }

    [HttpPost]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var token = User.FindFirst("Token")?.Value;
        if (string.IsNullOrEmpty(token)) return RedirectToAction("Login", "Account");

        await _productService.DeleteAsync(id, token);
        return RedirectToAction("Products");
    }

    [HttpGet]
    public async Task<IActionResult> EditProduct(int id)
    {
        var result = await _productService.GetByIdAsync(id);
        if (!result.Success || result.Data == null) return RedirectToAction("Products");

        return View(result.Data);
    }

    [HttpPost]
    public async Task<IActionResult> EditProduct(ProductDto dto)
    {
        var token = User.FindFirst("Token")?.Value;
        if (string.IsNullOrEmpty(token)) return RedirectToAction("Login", "Account");

        var result = await _productService.UpdateAsync(dto.Id, dto, token);
        if (result.Success) return RedirectToAction("Products");

        ModelState.AddModelError("", result.Message);
        return View(dto);
    }
}
