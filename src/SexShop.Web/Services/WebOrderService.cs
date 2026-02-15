using SexShop.Application.Common;
using SexShop.Application.DTOs;

namespace SexShop.Web.Services;

public interface IWebOrderService
{
    Task<ApiResponse<int>> CreateOrderAsync(OrderDto orderDto, string token);
    Task<ApiResponse<IEnumerable<OrderDto>>> GetMyOrdersAsync(string token);
}

public class WebOrderService : IWebOrderService
{
    private readonly IApiClient _apiClient;

    public WebOrderService(IApiClient apiClient)
    {
        _apiClient = apiClient;
    }

    public async Task<ApiResponse<int>> CreateOrderAsync(OrderDto orderDto, string token)
    {
        return await _apiClient.PostAsync<int>("api/order", orderDto, token);
    }

    public async Task<ApiResponse<IEnumerable<OrderDto>>> GetMyOrdersAsync(string token)
    {
        return await _apiClient.GetAsync<IEnumerable<OrderDto>>("api/order/my-orders", token);
    }
}
