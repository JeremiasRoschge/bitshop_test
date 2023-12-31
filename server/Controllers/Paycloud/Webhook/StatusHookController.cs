using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using server.Models;
using System.Text;
using Newtonsoft.Json;

namespace bitshop1.Controllers.Paycloud.Webhook
{


    public class StatusHookController : Controller
    {
        private readonly string _apiBaseUrl;

        public StatusHookController()
        {
            _apiBaseUrl = ConfigurationManager.AppSettings["PaycloudoApiBaseUrl"];
        }

        [HttpGet]
        public async Task<string> GetStatusOfQRPC(string reference)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    var paycloudController = new PaycloudController();
                    string accessToken = await paycloudController.ObtenerNuevoToken();
                    client.BaseAddress = new Uri(_apiBaseUrl);

                    client.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", $"Bearer {accessToken}");

                    var response = await client.GetAsync($"/api/v1/PaymentsExternal/QR/Status?getQRExternalView.referenceExternal={reference}&getQRExternalView.system=kioscobitsion");
                    response.EnsureSuccessStatusCode();

                    var statusResponse = await response.Content.ReadAsAsync<WebhookStatusResponse>();
                    var statusOrder = statusResponse?.Data?.Status;

                    return statusOrder ?? string.Empty;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting merchant order status: {ex.Message}");
                return string.Empty;
            }
        }


       


    }

    public class WebhookStatusResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public WebhookStatusData Data { get; set; }
        public string Code { get; set; }
    }

    public class WebhookStatusData
    {
        public int StatusId { get; set; }
        public string Status { get; set; }
    }
}