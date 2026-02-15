using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SexShop.Application.Common;
using SexShop.Application.DTOs;
using SexShop.Application.Interfaces.Services;

namespace SexShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductDto>>>> GetAll()
    {
        var products = await _productService.GetActiveProductsAsync();
        return Ok(ApiResponse<IEnumerable<ProductDto>>.SuccessResponse(products));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ProductDto>>> GetById(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        if (product == null) return NotFound(ApiResponse<ProductDto>.FailureResponse("Product not found"));
        return Ok(ApiResponse<ProductDto>.SuccessResponse(product));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProductDto>>> Create(CreateProductDto createProductDto)
    {
        var product = await _productService.CreateProductAsync(createProductDto);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, ApiResponse<ProductDto>.SuccessResponse(product));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Update(int id, ProductDto productDto)
    {
        await _productService.UpdateProductAsync(id, productDto);
        return Ok(ApiResponse<bool>.SuccessResponse(true, "Product updated"));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        await _productService.DeleteProductAsync(id);
        return Ok(ApiResponse<bool>.SuccessResponse(true, "Product deleted"));
    }
}
