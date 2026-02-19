using Microsoft.EntityFrameworkCore;
using SexShop.Domain.Entities;
using SexShop.Domain.Interfaces.Repositories;
using SexShop.Infrastructure.Data;

namespace SexShop.Infrastructure.Repositories;

public class ProductRepository : BaseRepository<Product>, IProductRepository
{
    public ProductRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Product>> GetActiveProductsAsync(int page = 1, int pageSize = 12)
    {
        return await _context.Products
            .Where(p => p.Activo)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }
}
