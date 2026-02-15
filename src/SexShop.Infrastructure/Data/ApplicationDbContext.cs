using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SexShop.Domain.Entities;

namespace SexShop.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderDetail> OrderDetails { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Product Configuration
        builder.Entity<Product>().Property(p => p.Price).HasPrecision(18, 2);

        // Order Configuration
        builder.Entity<Order>().Property(o => o.TotalAmount).HasPrecision(18, 2);

        // OrderDetail Configuration
        builder.Entity<OrderDetail>().Property(od => od.UnitPrice).HasPrecision(18, 2);
    }
}
