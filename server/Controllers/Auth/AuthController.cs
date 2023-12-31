using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using server.Models;
using static server.Models.AuthManager;

namespace bitshop1.Controllers
{
    public class AuthController : ApiController
    {
        private readonly AuthManager _authManager;

        public AuthController()
        {
            _authManager = new AuthManager();
        }

        [CustomAuthorize]
        [HttpGet]
        [Route("api/auth/validate")]
        public HttpResponseMessage ValidateToken(HttpRequestMessage request)
        {
            try
            {
                // Obtener el token del header
                var token = GetTokenFromHeader(request);

                bool isValid = AuthManager.ValidateToken(token);

                if (isValid)
                {
                    // Token vlido
                    return request.CreateResponse(System.Net.HttpStatusCode.OK, new { Valid = true });
                }
                else
                {
                    // Token invalido
                    return request.CreateResponse(System.Net.HttpStatusCode.Unauthorized, new { Valid = false });
                }
            }
            catch
            {             
                return request.CreateResponse(System.Net.HttpStatusCode.InternalServerError, "Error interno del servidor");
            }
        }

        private string GetTokenFromHeader(HttpRequestMessage request)
        {
            var authorizationHeader = request.Headers.Authorization;

            if (authorizationHeader != null && authorizationHeader.Scheme == "Bearer")
            {
                return authorizationHeader.Parameter;
            }

            return null;
        }

        [HttpPost]
        [Route("api/auth/login")]
        public async Task<HttpResponseMessage> Login(HttpRequestMessage request)
        {
            try
            {
                var response = await _authManager.Authenticate(request);

                return response;
            }
            catch
            {
                return request.CreateResponse(System.Net.HttpStatusCode.InternalServerError, "Error interno del servidor");
            }
        }

    }
}
