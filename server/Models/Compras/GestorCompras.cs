using server.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace bitshop1.Models.Compras
{
    public class GestorCompras
    {
        public List<ComprasData> getCompras(DateTime desde, DateTime hasta)
        {
            List<ComprasData> lista = new List<ComprasData>();
            string strConn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();
            string queryString = "SELECT co. id,co.cuil, co.id_prod,co.cantidad,co.gastos,co.fecha,co.tipo_de_pago,co.OrderId,pr.nombre, em.nombre_completo  FROM compras co INNER JOIN Productos pr ON pr.id = co.id_prod INNER JOIN Empleados em ON em.cuil = co.cuil WHERE co.fecha >= @desde AND co.fecha <= @hasta ORDER BY fecha DESC;";

            using (SqlConnection conn = new SqlConnection(strConn))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand(queryString, conn))
                {
                    cmd.Parameters.AddWithValue("@desde", desde);
                    cmd.Parameters.AddWithValue("@hasta", hasta);

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            int id = dr.GetInt32(0);
                            long cuil = dr.GetInt64(1);
                            int id_prod = dr.GetInt32(2);
                            int cantidad = dr.GetInt32(3);
                            int gastos = dr.GetInt32(4);
                            DateTime fecha = dr.GetDateTime(5);
                            string tipo_de_pago = dr.GetString(6);
                            long OrderId = dr.GetInt64(7);
                            string nombre_pr = dr.GetString(8);
                            string nombre_completo = dr.GetString(9);

                            ComprasData compra = new ComprasData(id, cuil, id_prod, cantidad, gastos, fecha, tipo_de_pago, OrderId, nombre_pr, nombre_completo);
                            lista.Add(compra);
                        }
                    }
                }
            }

            return lista;
        }


        private readonly Random random = new Random();

        private int GenerateReferenceId()
        {
            // Generar un número de 6 dígitos
            return random.Next(100000, 999999);
        }

        public bool addCompra(Compra compra)
        {
            bool res = false;

            string strConn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();

            using (SqlConnection conn = new SqlConnection(strConn))
            {
                conn.Open();
                SqlTransaction transaction = conn.BeginTransaction();

                try
                {
                    // Generar un referenceId de 6 dígitos
                    int referenceId = GenerateReferenceId();

                    // Insertar compra
                    SqlCommand cmdCompra = conn.CreateCommand();
                    cmdCompra.Transaction = transaction;

                    cmdCompra.CommandText = "INSERT INTO compras (cuil, id_prod, cantidad, gastos, fecha, tipo_de_pago, OrderId) VALUES (@cuil, @id_prod, @cantidad, @gastos, @fecha, @tipo_de_pago, @OrderId)";
                    cmdCompra.Parameters.AddWithValue("@cuil", compra.cuil);
                    cmdCompra.Parameters.AddWithValue("@id_prod", compra.id_prod);
                    cmdCompra.Parameters.AddWithValue("@cantidad", compra.cantidad);
                    cmdCompra.Parameters.AddWithValue("@gastos", compra.gastos);
                    cmdCompra.Parameters.AddWithValue("@fecha", compra.fecha);
                    cmdCompra.Parameters.AddWithValue("@tipo_de_pago", "Fin de mes");
                    cmdCompra.Parameters.AddWithValue("@OrderId", referenceId);
                    cmdCompra.ExecuteNonQuery();

                    // Actualizar stock en tabla productos
                    SqlCommand cmdUpdateStock = conn.CreateCommand();
                    cmdUpdateStock.Transaction = transaction;

                    cmdUpdateStock.CommandText = "UPDATE productos SET stock = stock - @cantidad WHERE id = @id_prod";
                    cmdUpdateStock.Parameters.AddWithValue("@id_prod", compra.id_prod);
                    cmdUpdateStock.Parameters.AddWithValue("@cantidad", compra.cantidad);
                    cmdUpdateStock.ExecuteNonQuery();

                    transaction.Commit();
                    res = true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    res = false;

                    try
                    {
                        transaction.Rollback();
                    }
                    catch (Exception exRollback)
                    {
                        Console.WriteLine("Error al intentar revertir la transacción: " + exRollback.Message);
                    }

                    throw;
                }
                finally
                {
                    conn.Close();
                }

                return res;
            }
        }

        public decimal SumarGastos(DateTime desde, DateTime hasta)
        {
            decimal totalGastos = 0;

            string strConn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();
            string queryString = "SELECT SUM(gastos) FROM compras WHERE fecha >= @desde AND fecha <= @hasta";


            using (SqlConnection conn = new SqlConnection(strConn))
            {

                conn.Open();

                SqlCommand cmd = new SqlCommand(queryString, conn);
                cmd.Parameters.AddWithValue("@desde", desde);
                cmd.Parameters.AddWithValue("@hasta", hasta);

                object result = cmd.ExecuteScalar();
                if (result != null && result != DBNull.Value)
                {
                    totalGastos = Convert.ToDecimal(result);
                }

                conn.Close();
            }

            return totalGastos;
        }

        public List<ComprasData> getComprasPorUsuarioYFecha(long cuil_id, int year, int month)
        {
            List<ComprasData> lista = new List<ComprasData>();
            string strConn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();

            // Asegúrate de usar parámetros en la consulta para evitar ataques de SQL injection
            string queryString = "SELECT co.id, co.cuil, co.id_prod, co.cantidad, co.gastos, co.fecha, co.tipo_de_pago, co.OrderId, pr.nombre, em.nombre_completo FROM compras co  INNER JOIN empleados em WHERE cuil = @cuil AND YEAR(fecha) = @year AND MONTH(fecha) = @month ORDER BY fecha DESC";

            using (SqlConnection conn = new SqlConnection(strConn))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand(queryString, conn))
                {
                    cmd.Parameters.AddWithValue("@cuil", cuil_id);
                    cmd.Parameters.AddWithValue("@year", year);
                    cmd.Parameters.AddWithValue("@month", month);

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            int id = dr.GetInt32(0);
                            long cuil = dr.GetInt64(1);
                            int id_prod = dr.GetInt32(2);
                            int cantidad = dr.GetInt32(3);
                            int gastos = dr.GetInt32(4);
                            DateTime fecha = dr.GetDateTime(5);
                            string tipo_de_pago = dr.GetString(6);
                            long OrderId = dr.GetInt64(7);
                            string nombre_pr = dr.GetString(8);
                            string nombre_completo = dr.GetString(9);

                            ComprasData compra = new ComprasData(id, cuil, id_prod, cantidad, gastos, fecha, tipo_de_pago, OrderId, nombre_pr, nombre_completo);
                            lista.Add(compra);
                        }
                    }
                }

                conn.Close();
            }

            return lista;
        }

        public Tuple<string, decimal> ObtenerGastosFinDeMes(long cuil, int year, int month)
        {
            string nombreEmpleado = string.Empty;
            decimal totalGastos = 0;

            string strConn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();
            string queryStringNombre = "SELECT nombre_completo FROM empleados WHERE cuil = @cuil";
            string queryStringGastos = "SELECT SUM(gastos) FROM compras WHERE cuil = @cuil AND tipo_de_pago = 'Fin de mes' AND YEAR(fecha) = @year AND MONTH(fecha) = @month";

            using (SqlConnection conn = new SqlConnection(strConn))
            {
                conn.Open();

                // Obtener el nombre del empleado
                SqlCommand cmdNombre = new SqlCommand(queryStringNombre, conn);
                cmdNombre.Parameters.AddWithValue("@cuil", cuil);
                object resultNombre = cmdNombre.ExecuteScalar();
                if (resultNombre != null && resultNombre != DBNull.Value)
                {
                    nombreEmpleado = resultNombre.ToString();
                }
                else
                {
                    conn.Close();
                    return new Tuple<string, decimal>("CUIL no encontrado", 0);
                }

                // Obtener los gastos
                SqlCommand cmdGastos = new SqlCommand(queryStringGastos, conn);
                cmdGastos.Parameters.AddWithValue("@cuil", cuil);
                cmdGastos.Parameters.AddWithValue("@year", year);
                cmdGastos.Parameters.AddWithValue("@month", month);
                object resultGastos = cmdGastos.ExecuteScalar();
                if (resultGastos != null && resultGastos != DBNull.Value)
                {
                    totalGastos = Convert.ToDecimal(resultGastos);
                }

                conn.Close();
            }

            return new Tuple<string, decimal>($"Gastos totales de {nombreEmpleado}", totalGastos);
        }
    }
    }