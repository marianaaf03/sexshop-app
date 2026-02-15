using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SexShop.Application.DTOs;
using SexShop.Web.Services;
using System.Security.Claims;

namespace SexShop.Web.Controllers;

[Authorize]
public class OrderController : Controller
{
    private readonly IWebOrderService _orderService;
    private readonly ICartService _cartService;

    public OrderController(IWebOrderService orderService, ICartService cartService)
    {
        _orderService = orderService;
        _cartService = cartService;
    }

    public async Task<IActionResult> Checkout()
    {
        var cart = _cartService.GetCart();
        if (!cart.Any()) return RedirectToAction("Index", "Cart");

        var token = User.FindFirst("Token")?.Value;
        if (string.IsNullOrEmpty(token)) return RedirectToAction("Login", "Account");

        var orderDto = new OrderDto
        {
            TotalAmount = _cartService.GetTotal(),
            Details = cart.Select(c => new OrderDetailDto
            {
                ProductId = c.ProductId,
                Quantity = c.Quantity,
                UnitPrice = c.Price
            }).ToList()
        };

        var result = await _orderService.CreateOrderAsync(orderDto, token);
        if (result.Success)
        {
            _cartService.ClearCart();
            TempData["SuccessMessage"] = "¡Gracias por tu compra! Tu pedido ha sido procesado con discreción.";
            return RedirectToAction("History");
        }

        TempData["ErrorMessage"] = result.Message;
        return RedirectToAction("Index", "Cart");
    }

    public async Task<IActionResult> History()
    {
        var token = User.FindFirst("Token")?.Value;
        if (string.IsNullOrEmpty(token)) return RedirectToAction("Login", "Account");

        var result = await _orderService.GetMyOrdersAsync(token);
        return View(result.Data ?? new List<OrderDto>());
    }
}
