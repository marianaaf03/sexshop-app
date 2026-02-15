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

    public async Task<IEnumerable<Product>> GetActiveProductsAsync()
    {
        return await _context.Products.Where(p => p.Activo).ToListAsync();
    }
}
