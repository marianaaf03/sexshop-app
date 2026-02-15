using System.Text.Json;
using SexShop.Application.DTOs;

namespace SexShop.Web.Services;

public class CartItem
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Total => Price * Quantity;
}

public interface ICartService
{
    List<CartItem> GetCart();
    void AddToCart(CartItem item);
    void RemoveFromCart(int productId);
    void UpdateQuantity(int productId, int quantity);
    void ClearCart();
    decimal GetTotal();
}

public class CartService : ICartService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private const string CartSessionKey = "SexShopCart";

    public CartService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public List<CartItem> GetCart()
    {
        var session = _httpContextAccessor.HttpContext?.Session;
        if (session == null) return new List<CartItem>();

        var cartJson = session.GetString(CartSessionKey);
        return string.IsNullOrEmpty(cartJson) 
            ? new List<CartItem>() 
            : JsonSerializer.Deserialize<List<CartItem>>(cartJson) ?? new List<CartItem>();
    }

    public void AddToCart(CartItem item)
    {
        var cart = GetCart();
        var existingItem = cart.FirstOrDefault(i => i.ProductId == item.ProductId);

        if (existingItem != null)
        {
            existingItem.Quantity += item.Quantity;
        }
        else
        {
            cart.Add(item);
        }

        SaveCart(cart);
    }

    public void RemoveFromCart(int productId)
    {
        var cart = GetCart();
        cart.RemoveAll(i => i.ProductId == productId);
        SaveCart(cart);
    }

    public void UpdateQuantity(int productId, int quantity)
    {
        var cart = GetCart();
        var item = cart.FirstOrDefault(i => i.ProductId == productId);
        
        if (item != null)
        {
            if (quantity <= 0)
            {
                // Remove item if quantity is 0 or negative
                cart.RemoveAll(i => i.ProductId == productId);
            }
            else
            {
                item.Quantity = quantity;
            }
            SaveCart(cart);
        }
    }

    public void ClearCart()
    {
        SaveCart(new List<CartItem>());
    }

    public decimal GetTotal()
    {
        return GetCart().Sum(i => i.Total);
    }

    private void SaveCart(List<CartItem> cart)
    {
        var session = _httpContextAccessor.HttpContext?.Session;
        if (session != null)
        {
            var cartJson = JsonSerializer.Serialize(cart);
            session.SetString(CartSessionKey, cartJson);
        }
    }
}
