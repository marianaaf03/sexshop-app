using System.Collections.Generic;
using System.Threading.Tasks;
using SexShop.Application.DTOs;

namespace SexShop.Application.Interfaces.Services;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync(int page = 1, int pageSize = 50);
    Task<IEnumerable<ProductDto>> GetActiveProductsAsync(int page = 1, int pageSize = 12);
    Task<ProductDto?> GetProductByIdAsync(int id);
    Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto);
    Task UpdateProductAsync(int id, ProductDto productDto);
    Task DeleteProductAsync(int id);
}
