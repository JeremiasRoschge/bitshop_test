using System;
using System.Web.Http;
using System.Web.Http.Cors;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Owin.Builder;
using Owin;

namespace bitshop1
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Configuración y servicios de Web API
            var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);

            // Rutas de Web API
            config.MapHttpAttributeRoutes();

            ConfigureJwtAuthentication(app => ConfigureWebApi(app, config));
        }

        private static void ConfigureWebApi(IAppBuilder app, HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }

        private static void ConfigureJwtAuthentication(Action<IAppBuilder> afterJwtConfigured)
        {
            var issuer = "Pepo";
            var audience = "Lupin";
            var secretKey = "PolinaPepoLupin99!99@BitShop0028";
            var signingKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(secretKey));

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = signingKey,
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = true,
                ValidAudience = audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            var jwtOptions = new Microsoft.Owin.Security.Jwt.JwtBearerAuthenticationOptions
            {
                AuthenticationMode = Microsoft.Owin.Security.AuthenticationMode.Active,
                TokenValidationParameters = tokenValidationParameters
            };

            var app = new AppBuilder();
            app.UseJwtBearerAuthentication(jwtOptions);

            afterJwtConfigured(app);
        }
    }
}
