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

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        var products = await _unitOfWork.Products.GetAllAsync();
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    public async Task<IEnumerable<ProductDto>> GetActiveProductsAsync()
    {
        var products = await _unitOfWork.Products.GetActiveProductsAsync();
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
            
            _mapper.Map(productDto, product);
            
            product.Id = originalId; 
            product.FechaCreacion = originalDate;
            
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
