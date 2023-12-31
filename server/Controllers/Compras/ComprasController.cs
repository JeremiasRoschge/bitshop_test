using server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using Irecaudo.WebApi.ActionFilters;
using System.Web.Http.Cors;
using HttpGetAttribute = System.Web.Http.HttpGetAttribute;
using RouteAttribute = System.Web.Http.RouteAttribute;
using bitshop1.Models.Compras;
using HttpPostAttribute = System.Web.Http.HttpPostAttribute;

namespace server.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "GET, POST, PUT, DELETE, OPTIONS")]
    public class ComprasController : ApiController
    {
        [HttpGet]
        [Route("api/compras/ObtenerCompras")]
        public IHttpActionResult ObtenerCompras()
        {
            try
            {
                var request = Request;

                if (request.Headers.TryGetValues("desde", out var desdeValues) &&
                    request.Headers.TryGetValues("hasta", out var hastaValues))
                {
                    if (DateTime.TryParse(desdeValues.First(), out var desde) &&
                        DateTime.TryParse(hastaValues.First(), out var hasta))
                    {
                        GestorCompras gestorCompras = new GestorCompras();
                        var resultado = gestorCompras.getCompras(desde, hasta);

                        return Ok(resultado);
                    }
                }

                return BadRequest("Formato de fecha incorrecto o faltan encabezados.");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }



        [HttpGet]
        [Route("api/compras/ObtenerGastos")]
        public IHttpActionResult getGastos() {
            try
            {
                var request = Request;

                if (request.Headers.TryGetValues("desde", out var desdeValues) &&
                    request.Headers.TryGetValues("hasta", out var hastaValues))
                {
                    if (DateTime.TryParse(desdeValues.First(), out var desde) &&
                        DateTime.TryParse(hastaValues.First(), out var hasta))
                    {
                        GestorCompras gestorCompras = new GestorCompras();
                        var resultado = gestorCompras.SumarGastos(desde, hasta);

                        return Ok(resultado);
                    }
                }

                return BadRequest("Formato de fecha incorrecto o faltan encabezados");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }

        }

        [HttpGet]
        [Route("api/compras/GastosFinDeMes/{cuil}/{year}/{month}")]
        public IHttpActionResult obtenerGastosFinDeMes(long cuil, int year, int month)
        {
            try
            {
                GestorCompras gestorCompras = new GestorCompras();
                var gastos = gestorCompras.ObtenerGastosFinDeMes(cuil, year, month);
                return Ok(gastos);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("api/compras/ObtenerComprasPorUsuarioYFecha/{cuil}/{year}/{month}")]
        public IHttpActionResult obtenerComprasPorUsuarioYFecha(long cuil, int year, int month)
        {
            try
            {
                GestorCompras gestorCompras = new GestorCompras();
                var resultado = gestorCompras.getComprasPorUsuarioYFecha(cuil, year, month);

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [HttpPost]
        [Route("api/compras/AgregarCompra")]
        public IHttpActionResult AgregarProducto([FromBody] Compra compra)
        {
            try
            {
                GestorCompras gestorCompras = new GestorCompras();
                bool resultado = gestorCompras.addCompra(compra);

                if (resultado)
                {
                    return Created(Request.RequestUri, resultado);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


    }
}
