using AutoMapper;
using SexShop.Application.DTOs;
using SexShop.Application.Interfaces.Services;
using SexShop.Domain.Entities;
using SexShop.Domain.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SexShop.Application.Services;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ProductService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync(int page = 1, int pageSize = 50)
    {
        var products = await _unitOfWork.Products.GetAllAsync(page, pageSize);
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    public async Task<IEnumerable<ProductDto>> GetActiveProductsAsync(int page = 1, int pageSize = 12)
    {
        var products = await _unitOfWork.Products.GetActiveProductsAsync(page, pageSize);
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        return _mapper.Map<ProductDto>(product);
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto)
    {
        var product = _mapper.Map<Product>(createProductDto);
        await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.CompleteAsync();
        return _mapper.Map<ProductDto>(product);
    }

    public async Task UpdateProductAsync(int id, ProductDto productDto)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product != null)
        {
            // Preserve ID and Creation Date to avoid EF tracking issues or data loss
            var originalId = product.Id;
            var originalDate = product.FechaCreacion;
            var originalActivo = product.Activo; // Preserve active status
            
            _mapper.Map(productDto, product);
            
            product.Id = originalId; 
            product.FechaCreacion = originalDate;
            product.Activo = originalActivo; // Restore active status
            
            _unitOfWork.Products.Update(product);
            await _unitOfWork.CompleteAsync();
        }
    }

    public async Task DeleteProductAsync(int id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product != null)
        {
            _unitOfWork.Products.Remove(product);
            await _unitOfWork.CompleteAsync();
        }
    }
}
