using System.Collections.Generic;
using SexShop.Domain.Enums;

namespace SexShop.Domain.Entities;

public class Order : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public virtual ICollection<OrderDetail> Details { get; set; } = new List<OrderDetail>();
}
