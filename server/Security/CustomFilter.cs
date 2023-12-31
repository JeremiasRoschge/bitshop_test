using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace Irecaudo.WebApi.ActionFilters
{
    public class CustomSimpleAuthorizationFilter : AuthorizeAttribute
    {
        //en autorizacion
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            try
            {

                //Veriofico si esta autorizado;            
                bool result = IsAuthorized(actionContext);

                if (result) return;

                //respondemos que no esta autenticado.
                HttpResponseMessage response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);


                actionContext.Response = response;
            }
            catch (Exception)
            {
                throw;
            }
        }

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            try
            {
                string antiForgeryCookieToken = string.Empty;
                string antiForgeryFormToken = string.Empty;
                string antiForgeryTokenValue = string.Empty;
                string antiForgerySource = string.Empty;

                IEnumerable<string> values;

                if (actionContext.Request.Headers.TryGetValues("__RequestVerificationSource", out values)) antiForgerySource = values.FirstOrDefault();

                #region app
                if (antiForgerySource == "SrcRefM")
                {
                    if (actionContext.Request.Headers.TryGetValues("__RequestVerificationToken", out values)) antiForgeryTokenValue = values.FirstOrDefault();

                    if (!string.IsNullOrEmpty(antiForgeryTokenValue))
                    {

                        string[] tokens = antiForgeryTokenValue.Split(':');

                        if (tokens.Length == 2)
                        {
                            antiForgeryCookieToken = tokens[0].Trim();
                            antiForgeryFormToken = tokens[1].Trim();
                        }
                        string antiForgeryCookie = ConfigurationManager.AppSettings.Get("AntiForgeryCookie");
                        string antiForgeryFrom = ConfigurationManager.AppSettings.Get("AntiForgeryFrom");

                        if (antiForgeryCookieToken != antiForgeryCookie || antiForgeryFormToken != antiForgeryFrom)
                        {
                            return false;
                        }

                        return true;
                    }
                }
                #endregion

                return base.IsAuthorized(actionContext);
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}