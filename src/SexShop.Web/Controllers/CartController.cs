using Microsoft.AspNetCore.Mvc;
using SexShop.Web.Services;

namespace SexShop.Web.Controllers;

public class CartController : Controller
{
    private readonly ICartService _cartService;
    private readonly IWebProductService _productService;

    public CartController(ICartService cartService, IWebProductService productService)
    {
        _cartService = cartService;
        _productService = productService;
    }

    public IActionResult Index()
    {
        var cart = _cartService.GetCart();
        return View(cart);
    }

    [HttpPost]
    public async Task<IActionResult> Add(int productId, int quantity = 1)
    {
        var productResult = await _productService.GetByIdAsync(productId);
        if (productResult.Success && productResult.Data != null)
        {
            var product = productResult.Data;
            _cartService.AddToCart(new CartItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                Price = product.Price,
                Quantity = quantity,
                ImageUrl = product.ImageUrl
            });
        }
        return RedirectToAction("Index");
    }

    public IActionResult Remove(int productId)
    {
        _cartService.RemoveFromCart(productId);
        return RedirectToAction("Index");
    }

    [HttpPost]
    public IActionResult UpdateQuantity(int productId, int quantity)
    {
        _cartService.UpdateQuantity(productId, quantity);
        return RedirectToAction("Index");
    }

    public IActionResult Clear()
    {
        _cartService.ClearCart();
        return RedirectToAction("Index");
    }
}
