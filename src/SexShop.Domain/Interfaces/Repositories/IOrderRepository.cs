using System.Collections.Generic;
using SexShop.Domain.Entities;

namespace SexShop.Domain.Interfaces.Repositories;

public interface IOrderRepository : IBaseRepository<Order>
{
    Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId);
}
