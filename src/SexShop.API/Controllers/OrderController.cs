using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SexShop.Application.Common;
using SexShop.Application.DTOs;
using SexShop.Domain.Interfaces;
using SexShop.Domain.Entities;
using SexShop.Domain.Enums;
using System.Security.Claims;

namespace SexShop.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public OrderController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<int>>> Create(OrderDto orderDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var order = new Order
        {
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            Status = OrderStatus.Pending,
            TotalAmount = orderDto.TotalAmount
        };

        foreach (var detailDto in orderDto.Details)
        {
            order.Details.Add(new OrderDetail
            {
                ProductId = detailDto.ProductId,
                Quantity = detailDto.Quantity,
                UnitPrice = detailDto.UnitPrice
            });
        }

        await _unitOfWork.Orders.AddAsync(order);
        await _unitOfWork.CompleteAsync();

        return Ok(ApiResponse<int>.SuccessResponse(order.Id, "Order created successfully"));
    }

    [HttpGet("my-orders")]
    public async Task<ActionResult<ApiResponse<IEnumerable<OrderDto>>>> GetMyOrders()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var orders = await _unitOfWork.Orders.GetOrdersByUserIdAsync(userId);
        var dtos = orders.Select(o => new OrderDto
        {
            Id = o.Id,
            OrderDate = o.OrderDate,
            TotalAmount = o.TotalAmount,
            Status = o.Status.ToString(),
            Details = o.Details.Select(d => new OrderDetailDto
            {
                ProductId = d.ProductId,
                ProductName = d.Product?.Name ?? "Unknown",
                Quantity = d.Quantity,
                UnitPrice = d.UnitPrice
            }).ToList()
        });

        return Ok(ApiResponse<IEnumerable<OrderDto>>.SuccessResponse(dtos));
    }
}
