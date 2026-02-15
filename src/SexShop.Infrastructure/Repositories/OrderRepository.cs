using Microsoft.EntityFrameworkCore;
using SexShop.Domain.Entities;
using SexShop.Domain.Interfaces.Repositories;
using SexShop.Infrastructure.Data;

namespace SexShop.Infrastructure.Repositories;

public class OrderRepository : BaseRepository<Order>, IOrderRepository
{
    public OrderRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId)
    {
        return await _context.Orders
            .Include(o => o.Details)
            .ThenInclude(d => d.Product)
            .Where(o => o.UserId == userId)
            .ToListAsync();
    }
}
