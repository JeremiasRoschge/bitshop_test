using server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace bitshop1.Controllers.Productos
{
    [EnableCors(origins: "*", headers: "*", methods: "GET, POST, PUT, DELETE, OPTIONS")]
    public class ProductoController : ApiController
    {
        [HttpGet]
        [Route("api/productos/ObtenerProducto")]
        public IHttpActionResult GetProductos()
        {
            try
            {
                GestorProducto gestorProducto = new GestorProducto();
                var resultado = gestorProducto.GetProductos();


                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [HttpGet]
        [Route("api/productos/ObtenerProducto/{id}")]

        public IHttpActionResult obtenerProducto(int id)
        {
            try
            {
                GestorProducto gestorProducto = new GestorProducto();
                var resultado = gestorProducto.GetById(id);
                return Ok(resultado);

            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("api/productos/AgregarProducto")]
        public IHttpActionResult AgregarProducto([FromBody] Producto producto)
        {
            try
            {
                GestorProducto gestorProducto = new GestorProducto();
                bool resultado = gestorProducto.addProducto(producto);

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



        [HttpDelete]
        [Route("api/productos/EliminarProducto/{id}")]
        public IHttpActionResult DeleteByID(int id)
        {
            try
            {
                GestorProducto gestorProducto = new GestorProducto();
                bool eliminado = gestorProducto.DeleteByID(id);

                if (eliminado)
                {
                    string mensaje = $"Se eliminó con éxito el producto id: {id}";

                    return Ok(mensaje);

                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPut]
        [Route("api/productos/ActualizarProducto/{SelectedID}")]
        public IHttpActionResult EditarProducto(int SelectedID, [FromBody] Producto producto)
        {
            try
            {
                GestorProducto gestorProducto = new GestorProducto();


                bool resultado = gestorProducto.UpdateProducto(SelectedID, producto);

                if (resultado)
                {
                    return Ok(resultado);
                }
                else
                {
                    return BadRequest("ERROR");
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}

