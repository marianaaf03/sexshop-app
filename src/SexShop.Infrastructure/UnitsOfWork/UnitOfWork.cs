using SexShop.Domain.Interfaces;
using SexShop.Domain.Interfaces.Repositories;
using SexShop.Infrastructure.Data;
using SexShop.Infrastructure.Repositories;

namespace SexShop.Infrastructure.UnitsOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IProductRepository _products = null!;
    private IOrderRepository _orders = null!;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public IProductRepository Products => _products ??= new ProductRepository(_context);
    public IOrderRepository Orders => _orders ??= new OrderRepository(_context);

    public async Task<int> CompleteAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
