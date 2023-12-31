using Newtonsoft.Json;
using System;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace server.Controllers
{
    public class MercadoPagoController : ApiController
    {
        [HttpPost]
        [Route("api/mercadopago/realizarPedido")]
        public async Task<IHttpActionResult> RealizarPedido([FromBody] ProductData productData)
        {
            try
            {
                string respuestaMercadoPago = await RealizarSolicitudMercadoPago(productData);

                var respuestaObjeto = JsonConvert.DeserializeObject<RespuestaMercadoPago>(respuestaMercadoPago);

                return Ok(respuestaObjeto);
            }
            catch (HttpRequestException ex)
            {
                var response = new HttpResponseMessage(HttpStatusCode.BadRequest)
                {
                    Content = new StringContent(ex.Message),
                    ReasonPhrase = "Error en la solicitud a la API de Mercado Pago"
                };
                throw new HttpResponseException(response);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        private async Task<string> RealizarSolicitudMercadoPago(ProductData productData)
        {
            string apiUrl = ConfigurationManager.AppSettings["MercadoPagoApiBaseUrl"];
            string accessToken = ConfigurationManager.AppSettings["MercadoPagoAccessToken"];
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");

                string jsonData = JsonConvert.SerializeObject(productData);
                StringContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");

                // Realiza el POST a la API de Mercado Pago
                HttpResponseMessage response = await client.PostAsync(apiUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    string successContent = await response.Content.ReadAsStringAsync();
                    return successContent;
                }
                else
                {
                    string errorContent = await response.Content.ReadAsStringAsync();

                    Console.WriteLine($"Error en la solicitud a la API de Mercado Pago: {errorContent}");

                    throw new HttpRequestException($"Error en la solicitud a la API de Mercado Pago: {errorContent}");
                }
            }
        }
    }

    public class RespuestaMercadoPago
    {
        public string in_store_order_id { get; set; }
        public string qr_data { get; set; }
    }
}
