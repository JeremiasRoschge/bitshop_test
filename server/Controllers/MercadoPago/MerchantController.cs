using System;
using System.Configuration;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

public class MerchantOrderController : ApiController
{
    private readonly string _apiBaseUrl;
    private readonly string _accessToken;

    public MerchantOrderController()
    {
        _apiBaseUrl = ConfigurationManager.AppSettings["MercadoPagoApiBaseUrl"];
        _accessToken = ConfigurationManager.AppSettings["MercadoPagoAccessToken"];
    }

    [HttpGet]
    public async Task<string> GetMerchantOrderStatus(string id)
    {
        try
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(_apiBaseUrl);
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_accessToken}");

                var response = await client.GetAsync($"/merchant_orders/{id}");
                response.EnsureSuccessStatusCode();

                var merchantOrder = await response.Content.ReadAsAsync<MerchantOrder>();
                return merchantOrder.status;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting merchant order status: {ex.Message}");
            return string.Empty;
        }
    }
}

public class MerchantOrder
{
    public string status { get; set; }
}