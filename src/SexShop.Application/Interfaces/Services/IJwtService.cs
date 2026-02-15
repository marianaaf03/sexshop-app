using SexShop.Domain.Entities;

namespace SexShop.Application.Interfaces.Services;

public interface IJwtService
{
    string GenerateToken(ApplicationUser user, IList<string> roles);
}
