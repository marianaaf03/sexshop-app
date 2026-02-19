using System.Collections.Generic;
using SexShop.Domain.Entities;

namespace SexShop.Domain.Interfaces.Repositories;

public interface IProductRepository : IBaseRepository<Product>
{
    Task<IEnumerable<Product>> GetActiveProductsAsync(int page = 1, int pageSize = 12);
}
