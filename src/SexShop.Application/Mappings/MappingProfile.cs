using AutoMapper;
using SexShop.Application.DTOs;
using SexShop.Domain.Entities;

namespace SexShop.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductDto>().ReverseMap();
        CreateMap<CreateProductDto, Product>();
        
        CreateMap<ApplicationUser, UserDto>();
        
        CreateMap<Order, OrderDto>().ReverseMap();
        CreateMap<OrderDetail, OrderDetailDto>().ReverseMap();
    }
}
