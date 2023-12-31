using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace server.Models
{
    public class ComprasData
    {
        public int id { get; set; }
        public long cuil { get; set; }
        public int id_prod { get; set; }
        public int cantidad { get; set; }
        public int gastos { get; set; }
        public DateTime fecha { get; set; }
        public string tipo_de_pago { get; set; }
        public long OrderId { get; set; }
        public string nombre_pr { get; set; }
        public string nombre_completo { get; set; }
        public ComprasData() { }

        public ComprasData(int Id, long CUIL, int Id_prod, int Cantidad, int Gastos, DateTime Fecha, string Tipo_de_pago, long orderId, string Nombre_pr, string Nombre_completo)
        {
            id = Id;
            cuil = CUIL;
            id_prod = Id_prod;
            cantidad = Cantidad;
            gastos = Gastos;
            fecha = Fecha;
            tipo_de_pago = Tipo_de_pago;
            OrderId = orderId;
            nombre_pr = Nombre_pr;
            nombre_completo = Nombre_completo;
        }

    }
}