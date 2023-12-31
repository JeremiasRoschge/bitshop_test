using Microsoft.IdentityModel.Tokens;
using server.Models;
using System;
using System.Configuration;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace server.Models
{
    public class AuthManager
    {

        public static bool ValidateToken(string token)
        {
            var issuer = "Pepo";
            var audience = "Lupin";
            var secretKey = "PolinaPepoLupin99!99@BitShop0028";

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = true,
                ValidAudience = audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            try
            {
                SecurityToken validatedToken;
                var handler = new JwtSecurityTokenHandler();
                ClaimsPrincipal principal = handler.ValidateToken(token, tokenValidationParameters, out validatedToken);

                return true; // Token válido
            }
            catch (ArgumentException ex)
            {
                // Loguea el error de validación del token
                Console.WriteLine($"Error al validar el token: {ex.Message}");
                return false; // Token inválido
            }
            catch (SecurityTokenException ex)
            {
                // Loguea el error de validación del token
                Console.WriteLine($"Error al validar el token: {ex.Message}");
                return false; // Token inválido
            }
        }

        public class CustomAuthorizeAttribute : AuthorizeAttribute
        {
            protected override bool IsAuthorized(HttpActionContext actionContext)
            {
                var authorizationHeader = actionContext.Request.Headers.Authorization;

                if (authorizationHeader != null && authorizationHeader.Scheme == "Bearer")
                {
                    var token = authorizationHeader.Parameter;

                    if (ValidateToken(token))
                    {
                        return true;
                    }
                }

                return false;
            }
        }


        public async Task<HttpResponseMessage> Authenticate(HttpRequestMessage request)
        {
            try
            {
                // Obtener los datos del body de la solicitud
                var data = await request.Content.ReadAsAsync<AuthRequest>();

                // Obtener el usuario desde la base de datos
                Empleado empleado = AuthenticateUser(data.Pin);

                // Comprobar si el usuario es valido
                if (empleado == null)
                {
                    // Usuario no autorizado
                    return request.CreateResponse(HttpStatusCode.Unauthorized, "Usuario no autorizado");
                }

                // Usuario autenticado, generar el token 
                string token = GenerateJwtToken(empleado);

                // Devolver el token y la información del usuario en el cuerpo de la respuesta
                return request.CreateResponse(HttpStatusCode.OK, new { Token = token, User = empleado });
            }
            catch (Exception ex)
            {
                // Loguea el error
                Console.WriteLine($"Error en AuthManager.Authenticate: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");

                // Devuelve el error interno del servidor
                return request.CreateResponse(HttpStatusCode.InternalServerError, "Error interno del servidor");
            }
        }

        private Empleado AuthenticateUser(string pin)
        {
            string strConn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();
            string queryString = "SELECT * FROM empleados WHERE pin = @Pin";

            using (SqlConnection conn = new SqlConnection(strConn))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand(queryString, conn))
                {
                    cmd.Parameters.AddWithValue("@Pin", pin);

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            return new Empleado
                            {
                                cuil = dr.GetInt64(0),
                                nombre_completo = dr.GetString(1).Trim(),
                                pin = dr.GetString(2).Trim(),
                                role = dr.GetString(3).Trim()
                            };
                        }
                        else
                        {
                            // No se encontró el usuario
                            return null;
                        }
                    }
                }
            }
        }

        private string GenerateJwtToken(Empleado empleado)
        {
            var issuer = "Pepo";
            var audience = "Lupin";
            var secretKey = "PolinaPepoLupin99!99@BitShop0028";
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: new[]
                {
                    new Claim(JwtRegisteredClaimNames.NameId, empleado.cuil.ToString()),
                    new Claim(JwtRegisteredClaimNames.UniqueName, empleado.nombre_completo),
             
                },
                expires: DateTime.UtcNow.AddMinutes(30), // 30 minutos!
                signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
    public class AuthRequest
    {
        public string Pin { get; set; }
    }


}

