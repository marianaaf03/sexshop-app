using Microsoft.AspNetCore.Mvc;
using SexShop.Web.Services;
using SexShop.Application.DTOs;

namespace SexShop.Web.Controllers;

public class HomeController : Controller
{
    private readonly IWebProductService _productService;

    public HomeController(IWebProductService productService)
    {
        _productService = productService;
    }

    public async Task<IActionResult> Index(string? category = null, string? searchString = null)
    {
        var result = await _productService.GetAllAsync();
        var products = result.Data ?? new List<ProductDto>();
        
        // Filter by category if specified
        if (!string.IsNullOrEmpty(category))
        {
            products = products.Where(p => p.Category != null && 
                p.Category.Equals(category, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        // Filter by search string if specified
        if (!string.IsNullOrEmpty(searchString))
        {
            products = products.Where(p => p.Name.Contains(searchString, StringComparison.OrdinalIgnoreCase) || 
                                           (p.Description != null && p.Description.Contains(searchString, StringComparison.OrdinalIgnoreCase))).ToList();
        }
        
        ViewBag.CurrentCategory = category;
        ViewBag.SearchString = searchString;
        
        ViewBag.CurrentCategory = category;
        return View(products);
    }

    public async Task<IActionResult> Details(int id)
    {
        var result = await _productService.GetByIdAsync(id);
        if (!result.Success) return NotFound();
        return View(result.Data);
    }
}
