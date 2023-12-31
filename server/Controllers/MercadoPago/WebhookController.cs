using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

[EnableCors(origins: "*", headers: "*", methods: "GET, POST, PUT, DELETE, OPTIONS")]
public class WebhookController : ApiController
{
    private static string lastReceivedOrderId;
    [HttpPost]
    [Route("api/webhook/receive")]
    public async Task<HttpResponseMessage> ReceiveWebhook()
    {
        try
        {
            string requestBody = await Request.Content.ReadAsStringAsync();
            Console.WriteLine($"Webhook Payload: {requestBody}");

            var webhookPayload = JsonConvert.DeserializeObject<WebhookPayload>(requestBody);

            string resourceUrl = webhookPayload?.resource;
            if (!string.IsNullOrEmpty(resourceUrl))
            {
                var uri = new Uri(resourceUrl);
                var segments = uri.Segments;
                if (segments.Length > 0)
                {
                    string orderId = segments[segments.Length - 1].TrimEnd('/');

                    lastReceivedOrderId = orderId;
                    Console.WriteLine($"Order ID extracted: {lastReceivedOrderId}");
                }
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Algo salió mal");
        }
    }



    [HttpPost]
    [Route("api/webhook/addtodb")]
    public async Task<IHttpActionResult> AgregarProducto([FromBody] List<PreCompra> precomprasData)
    {
        try
        {
            if (precomprasData == null || precomprasData.Count == 0)
            {
                Console.WriteLine("No se recibieron datos de compra.");
                return BadRequest("No se recibieron datos de compra.");
            }

            var merchantOrderController = new MerchantOrderController();
            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BDLocal"].ToString()))
            {
                connection.Open();

                foreach (var compra in precomprasData)
                {
                    using (SqlCommand cmd = connection.CreateCommand())
                    {
                        try
                        {
                            cmd.CommandText = "INSERT INTO compras (cuil, id_prod, cantidad, gastos, fecha, tipo_de_pago, OrderId) " +
                                              "VALUES (@Cuil, @ProductoId, @Cantidad, @Gastos, @Fecha, @TipoDePago, @OrderId)";

                            cmd.Parameters.AddWithValue("@Cuil", compra.cuil);
                            cmd.Parameters.AddWithValue("@ProductoId", compra.id_prod);
                            cmd.Parameters.AddWithValue("@Cantidad", compra.cantidad);
                            cmd.Parameters.AddWithValue("@Gastos", compra.gastos);
                            cmd.Parameters.AddWithValue("@Fecha", compra.fecha);
                            cmd.Parameters.AddWithValue("@TipoDePago", "MercadoPago");
                            cmd.Parameters.AddWithValue("@OrderId", "");

                            cmd.ExecuteNonQuery();

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

}

public class WebhookPayload
{
    public string resource { get; set; }
    public string topic { get; set; }
}

public class WebhookData
{
    public string id { get; set; }
}

public class OrderDetails
{
    public string id { get; set; }
    public string status { get; set; }
}

public class PreCompra
{
    public long cuil { get; set; }
    public int id_prod { get; set; }
    public int cantidad { get; set; }
    public int gastos { get; set; }
    public DateTime fecha { get; set; }
    public string tipo_de_pago { get; set; }
    public string OrderId { get; set; }
}
