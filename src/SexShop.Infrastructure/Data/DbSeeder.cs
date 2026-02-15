using Microsoft.Extensions.Configuration;

namespace SexShop.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
    {
        // Seed Roles
        if (!await roleManager.RoleExistsAsync("Admin"))
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        if (!await roleManager.RoleExistsAsync("Guest"))
            await roleManager.CreateAsync(new IdentityRole("Guest"));

        // Seed Admin User
        var adminEmail = configuration["AdminSettings:Email"] ?? "admin@sexshop.com";
        var adminPassword = configuration["AdminSettings:Password"] ?? "Admin123!";
        
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                Nombre = configuration["AdminSettings:Nombre"] ?? "Admin",
                Apellido = configuration["AdminSettings:Apellido"] ?? "General",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(adminUser, adminPassword);
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }

        // Seed Products
        if (!context.Products.Any())
        {
            var products = new List<Product>
            {
                // Para Él
                new() { Name = "Anillo Vibrador PowerRing Pro", Description = "Anillo recargable con 7 modos de vibración para mayor duración y estimulación compartida.", Price = 89900, Stock = 25, ImageUrl = "/images/powerring-pro.jpg", Category = "Para Él", Activo = true },
                new() { Name = "Masturbador Real Feel Xtreme", Description = "Manga texturizada con material ultra suave y diseño anatómico realista.", Price = 129900, Stock = 18, ImageUrl = "/images/real-feel-xtreme.jpg", Category = "Para Él", Activo = true },
                new() { Name = "Bomba de Vacío Titan Pump", Description = "Dispositivo manual que mejora la firmeza y circulación. Incluye manómetro.", Price = 159900, Stock = 12, ImageUrl = "/images/titan-pump.jpg", Category = "Para Él", Activo = true },
                new() { Name = "Gel Retardante Control Plus", Description = "Gel tópico que ayuda a prolongar el tiempo de duración.", Price = 39900, Stock = 40, ImageUrl = "/images/control-plus.jpg", Category = "Para Él", Activo = true },
                new() { Name = "Masturbador Automático TurboMotion", Description = "Dispositivo eléctrico con función de succión y vibración ajustable.", Price = 289900, Stock = 10, ImageUrl = "/images/turbomotion.jpg", Category = "Para Él", Activo = true },

                // Para Ella
                new() { Name = "Estimulador Punto G Sensation", Description = "Curvatura ergonómica para estimular el punto G con 10 velocidades.", Price = 119900, Stock = 20, ImageUrl = "/images/g-sensation.jpg", Category = "Para Ella", Activo = true },
                new() { Name = "Bala Vibradora Mini Secret", Description = "Compacta, discreta y silenciosa con múltiples intensidades.", Price = 59900, Stock = 35, ImageUrl = "/images/mini-secret.jpg", Category = "Para Ella", Activo = true },
                new() { Name = "Huevo Vibrador Wireless Love", Description = "Control remoto inalámbrico con 12 patrones de vibración.", Price = 139900, Stock = 15, ImageUrl = "/images/wireless-love.jpg", Category = "Para Ella", Activo = true },
                new() { Name = "Succionador Clímax AirTouch", Description = "Tecnología de ondas de presión para estimulación sin contacto directo.", Price = 199900, Stock = 14, ImageUrl = "/images/climax-airtouch.jpg", Category = "Para Ella", Activo = true },
                new() { Name = "Kit Bolas Kegel FitPro", Description = "Set de pesas progresivas para fortalecer el suelo pélvico.", Price = 79900, Stock = 28, ImageUrl = "/images/kegel-fitpro.jpg", Category = "Para Ella", Activo = true },

                // Vibradores
                new() { Name = "Vibrador Rabbit Deluxe", Description = "Doble estimulación con brazo flexible y 12 funciones.", Price = 179900, Stock = 16, ImageUrl = "/images/rabbit-deluxe.jpg", Category = "Vibradores", Activo = true },
                new() { Name = "Vibrador Clásico Velvet Touch", Description = "Diseño elegante y motor potente con 8 velocidades.", Price = 99900, Stock = 22, ImageUrl = "/images/velvet-touch.jpg", Category = "Vibradores", Activo = true },
                new() { Name = "Vibrador Recargable Luxury Gold", Description = "Acabado premium resistente al agua.", Price = 219900, Stock = 9, ImageUrl = "/images/luxury-gold.jpg", Category = "Vibradores", Activo = true },
                new() { Name = "Vibrador Flexible Silicone Soft", Description = "Material hipoalergénico y diseño adaptable.", Price = 109900, Stock = 19, ImageUrl = "/images/silicone-soft.jpg", Category = "Vibradores", Activo = true },
                new() { Name = "Vibrador Doble Impacto DuoPlay", Description = "Ideal para parejas con vibración dual sincronizada.", Price = 149900, Stock = 13, ImageUrl = "/images/duoplay.jpg", Category = "Vibradores", Activo = true },

                // Cosméticos
                new() { Name = "Lubricante Base Agua SilkTouch", Description = "Fórmula ligera, compatible con preservativos y juguetes.", Price = 29900, Stock = 60, ImageUrl = "/images/silktouch.jpg", Category = "Cosméticos", Activo = true },
                new() { Name = "Lubricante Sabor Fresa SweetLove", Description = "Aroma y sabor agradable, textura sedosa.", Price = 34900, Stock = 45, ImageUrl = "/images/sweetlove.jpg", Category = "Cosméticos", Activo = true },
                new() { Name = "Aceite de Masaje Sensual WarmUp", Description = "Efecto calor suave con aroma relajante.", Price = 49900, Stock = 30, ImageUrl = "/images/warmup.jpg", Category = "Cosméticos", Activo = true },
                new() { Name = "Spray Refrescante Íntimo FreshCare", Description = "Higiene íntima con fórmula suave.", Price = 24900, Stock = 50, ImageUrl = "/images/freshcare.jpg", Category = "Cosméticos", Activo = true },
                new() { Name = "Gel Estimulante Sensation Boost", Description = "Incrementa la sensibilidad con efecto frío/calor.", Price = 44900, Stock = 27, ImageUrl = "/images/sensation-boost.jpg", Category = "Cosméticos", Activo = true },

                // Accesorios
                new() { Name = "Esposas Ajustables SatinBond", Description = "Material suave con cierre de velcro ajustable.", Price = 39900, Stock = 33, ImageUrl = "/images/satinbond.jpg", Category = "Accesorios", Activo = true },
                new() { Name = "Antifaz Sensual DarkSilk", Description = "Tela satinada para experiencias sensoriales.", Price = 19900, Stock = 55, ImageUrl = "/images/darksilk.jpg", Category = "Accesorios", Activo = true },
                new() { Name = "Pluma Estimulante FeatherPlay", Description = "Ideal para juegos previos y exploración sensorial.", Price = 14900, Stock = 40, ImageUrl = "/images/featherplay.jpg", Category = "Accesorios", Activo = true },
                new() { Name = "Kit Juego de Dados Eróticos FunDice", Description = "Dados con acciones y partes del cuerpo.", Price = 24900, Stock = 38, ImageUrl = "/images/fundice.jpg", Category = "Accesorios", Activo = true },
                new() { Name = "Látigo Suave PleasureTouch", Description = "Material flexible para juegos ligeros.", Price = 44900, Stock = 21, ImageUrl = "/images/pleasuretouch.jpg", Category = "Accesorios", Activo = true },

                // Diversión
                new() { Name = "Juego Cartas Pícara Noche", Description = "Cartas con retos románticos y atrevidos.", Price = 29900, Stock = 48, ImageUrl = "/images/picara-noche.jpg", Category = "Diversión", Activo = true },
                new() { Name = "Kit Fiesta Íntima Deluxe", Description = "Incluye dados, cartas y accesorios sorpresa.", Price = 79900, Stock = 15, ImageUrl = "/images/fiesta-intima.jpg", Category = "Diversión", Activo = true },
                new() { Name = "Set Body Shot PartyFun", Description = "Vasos corporales y sabores dulces para eventos.", Price = 54900, Stock = 20, ImageUrl = "/images/body-shot.jpg", Category = "Diversión", Activo = true },
                new() { Name = "Juego Ruleta del Deseo", Description = "Ruleta interactiva con diferentes desafíos.", Price = 49900, Stock = 18, ImageUrl = "/images/ruleta-deseo.jpg", Category = "Diversión", Activo = true },
                new() { Name = "Kit Parejas Conexión Total", Description = "Incluye accesorios y guía para fortalecer la intimidad.", Price = 119900, Stock = 11, ImageUrl = "/images/conexion-total.jpg", Category = "Diversión", Activo = true }
            };

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
        }
    }
}
