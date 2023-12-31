using System;
using System.Net;
using System.Web.Http;
using Irecaudo.WebApi.ActionFilters;
using System.Web.Http.Cors;
using server.Models;
using static server.Models.AuthManager;

namespace server.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "GET, POST, PUT, DELETE, OPTIONS")]

    public class EmpleadoController : ApiController
    {
        [HttpGet]
        [Route("api/empleados/ObtenerEmpleado")]
        public IHttpActionResult obtenerEmpleados()
        {
            try
            {
                GestorEmpleado gestorEmpleado = new GestorEmpleado();
                var resultado = gestorEmpleado.getEmpleados();


                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [CustomAuthorize]
        [HttpGet]
        [Route("api/empleados/ObtenerEmpleado/{cuil}")]

        public IHttpActionResult obtenerEmpleado(long cuil)
        {
            try
            {
                GestorEmpleado gestorEmpleado = new GestorEmpleado();
                var resultado = gestorEmpleado.GetByCuil(cuil);
                return Ok(resultado);

            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("api/empleados/AgregarEmpleado")]
        public IHttpActionResult AgregarEmpleado([FromBody] Empleado empleado)
        {
            try
            {
                GestorEmpleado gestorEmpleado = new GestorEmpleado();


                bool resultado = gestorEmpleado.addEmpleado(empleado);

                if (resultado)
                {
                    // Si se agrega el empleado con éxito, devuelve una respuesta 201
                    return Created(Request.RequestUri, resultado);
                }
                else
                {
                    // Si no se puede agregar el empleado, devuelve 400
                    string mensaje = "pin/cuil ";
                    return BadRequest(mensaje);
                }
            }
            catch (Exception ex)
            { 
                return InternalServerError(ex);
            }
        }

        [HttpDelete]
        [Route("api/empleados/deleteByCuilEmployee/{cuil}")]
        public IHttpActionResult deleteByCuilEmployee(string cuil)
        {
            try
            {
                GestorEmpleado gestorEmpleado = new GestorEmpleado();
                bool eliminado = gestorEmpleado.DeleteByCuil(cuil);

                if (eliminado)
                {
                    string mensaje = $"Se eliminó con éxito el empleado cuil: {cuil}";


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
        [Route("api/empleados/UpdateEmployee/{selectedcuil}")]
        public IHttpActionResult EditarEmpleado(long selectedcuil, [FromBody] Empleado empleado)
        {
            try
            {
                GestorEmpleado gestorEmpleado = new GestorEmpleado();


                bool resultado = gestorEmpleado.UpdateEmployee(selectedcuil, empleado);

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