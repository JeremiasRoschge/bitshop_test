using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using server.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace bitshop1.Controllers.Paycloud
{
    public class PaycloudController : ApiController
    {
        [HttpPost]
        [Route("api/paycloud/crearQR")]
        public async Task<IHttpActionResult> CrearQR([FromBody] QR qr)
        {
            try
            {
                // Obtener un nuevo token para cada solicitud
                string accessToken = await ObtenerNuevoToken();
                var urlBaseApi = ConfigurationManager.AppSettings["PaycloudApiBaseUrl"];
                // Usar el nuevo token en la solicitud
                string apiUrl = $"{urlBaseApi}/api/v1/PaymentsExternal/Account/Status/QR";
                var queryParams = new
                {
                    amount = qr.Amount,
                    tributaryIdentifier = qr.TributaryIdentifier,
                    cvu = qr.Cvu,
                    referenceExternal = qr.ReferenceExternal,
                    expirationMinute = qr.ExpirationMinute,
                    system = qr.System,
                    title = qr.Title
                };

                var queryString = string.Join("&", queryParams.GetType().GetProperties()
                    .Select(prop => $"{prop.Name}={(prop.GetValue(queryParams) ?? "").ToString()}"));

                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", $"Bearer {accessToken}");

                    HttpResponseMessage externalApiResponse = await client.GetAsync($"{apiUrl}?{queryString}");

                    if (externalApiResponse.IsSuccessStatusCode)
                    {
                        string externalApiResponseContent = await externalApiResponse.Content.ReadAsStringAsync();
                        return Json(JsonConvert.DeserializeObject(externalApiResponseContent));
                    }
                    else
                    {
                        return BadRequest($"Error al realizar la solicitud a la API externa: {apiUrl}?{queryString}");
                    }
                }
            }
            catch (Exception ex)
            {
                // Manejar cualquier excepción y devolver un código de estado 500 (Error interno del servidor)
                return InternalServerError(ex);
            }
        }


        [HttpPost]
        [Route("api/paycloud/addtodb")]
        public async Task<IHttpActionResult> AgregarProducto([FromBody] List<PreCompra> precomprasData)
        {
            try
            {
                if (precomprasData == null || precomprasData.Count == 0)
                {
                    return BadRequest("No se recibieron datos de compra.");
                }

                using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BDLocal"].ToString()))
                {
                    connection.Open();

                    foreach (var compra in precomprasData)
                    {
                        // El OrderId no existe, se agrega a la db
                        using (SqlCommand cmd = connection.CreateCommand())
                        {
                            try
                            {
                                cmd.CommandText = "INSERT INTO compras (cuil, id_prod, cantidad, gastos, fecha, tipo_de_pago, OrderId) " +
                                                    "VALUES (@cuil, @id_prod, @cantidad, @gastos, @fecha, @tipo_de_pago, @OrderId)";

                                cmd.Parameters.AddWithValue("@cuil", compra.cuil);
                                cmd.Parameters.AddWithValue("@id_prod", compra.id_prod);
                                cmd.Parameters.AddWithValue("@cantidad", compra.cantidad);
                                cmd.Parameters.AddWithValue("@gastos", compra.gastos);
                                cmd.Parameters.AddWithValue("@fecha", compra.fecha);
                                cmd.Parameters.AddWithValue("@tipo_de_pago", "Paycloud");
                                cmd.Parameters.AddWithValue("@OrderId", "");

                                cmd.ExecuteNonQuery();
                                // Segunda consulta: Actualizar el stock en la tabla 'productos'
                                SqlCommand cmdUpdateStock = connection.CreateCommand();

                                cmdUpdateStock.CommandText = "UPDATE productos SET stock = stock - @cantidad WHERE id = @id_prod";
                                cmdUpdateStock.Parameters.AddWithValue("@id_prod", compra.id_prod);
                                cmdUpdateStock.Parameters.AddWithValue("@cantidad", compra.cantidad);
                                cmdUpdateStock.ExecuteNonQuery();
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Error al agregar a la base de datos: {ex.Message}");

                            }
                            finally
                            {
                                cmd.Parameters.Clear();
                            }
                        }
                    }

                    return Ok(true);
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("api/paycloud/webhook/receive")]
        public async Task<IHttpActionResult> ReceiveWebhook([FromBody] PCWebhookData webhookData)
        {
            try
            {

                return Ok("Webhook recibido correctamente");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }



        public async Task<string> ObtenerNuevoToken()
        {
            var urlBaseApi = ConfigurationManager.AppSettings["PaycloudApi"];

            string tokenUrl = $"{urlBaseApi}/api/Account/Token";
            string tokenBody = ConfigurationManager.AppSettings["PaycloudApiCredentials"];
            tokenBody = tokenBody.Replace("\"", "&");

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/x-www-form-urlencoded");

                HttpResponseMessage tokenResponse = await client.PostAsync(tokenUrl, new StringContent(tokenBody, Encoding.UTF8, "application/x-www-form-urlencoded"));

                if (tokenResponse.IsSuccessStatusCode)
                {
                    string responseContent = await tokenResponse.Content.ReadAsStringAsync();
                    JObject jsonResponse = JObject.Parse(responseContent);
                    string accessToken = jsonResponse["access_token"].ToString();
                    return accessToken;
                }
                else
                {
                    throw new InvalidOperationException($"Error al obtener el token: {tokenResponse.ReasonPhrase}");
                }
            }
        }
    }
}
