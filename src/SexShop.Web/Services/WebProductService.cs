using SexShop.Application.Common;
using SexShop.Application.DTOs;

namespace SexShop.Web.Services;

public interface IWebProductService
{
    Task<ApiResponse<IEnumerable<ProductDto>>> GetAllAsync();
    Task<ApiResponse<ProductDto>> GetByIdAsync(int id);
    Task<ApiResponse<ProductDto>> CreateAsync(CreateProductDto product, string token);
    Task<ApiResponse<bool>> UpdateAsync(int id, ProductDto product, string token);
    Task<ApiResponse<bool>> DeleteAsync(int id, string token);
}

public class WebProductService : IWebProductService
{
    private readonly IApiClient _apiClient;

    public WebProductService(IApiClient apiClient)
    {
        _apiClient = apiClient;
    }

    public async Task<ApiResponse<IEnumerable<ProductDto>>> GetAllAsync()
    {
        return await _apiClient.GetAsync<IEnumerable<ProductDto>>("api/product");
    }

    public async Task<ApiResponse<ProductDto>> GetByIdAsync(int id)
    {
        return await _apiClient.GetAsync<ProductDto>($"api/product/{id}");
    }

    public async Task<ApiResponse<ProductDto>> CreateAsync(CreateProductDto product, string token)
    {
        return await _apiClient.PostAsync<ProductDto>("api/product", product, token);
    }

    public async Task<ApiResponse<bool>> UpdateAsync(int id, ProductDto product, string token)
    {
        return await _apiClient.PutAsync<bool>($"api/product/{id}", product, token);
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id, string token)
    {
        return await _apiClient.DeleteAsync<bool>($"api/product/{id}", token);
    }
}
