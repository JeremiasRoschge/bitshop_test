using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace server.Models
{
    public class GestorEmpleado
    {


        public List<Empleado> getEmpleados()
        {
            List<Empleado> lista = new List<Empleado>();
            string strConn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();
            string queryString = "SELECT * FROM empleados";

            using (SqlConnection conn = new SqlConnection(strConn))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(queryString, conn);

                SqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    long cuil = dr.GetInt64(0);
                    string nombre_completo = dr.GetString(1).Trim();
                    string pin = dr.GetString(2).Trim();
                    string role = dr.GetString(3).Trim();

                    Empleado empleado = new Empleado(cuil, nombre_completo, pin, role);
                    lista.Add(empleado);
                }
                dr.Close();
                conn.Close();
            }

            return lista;
        }


        public bool addEmpleado(Empleado empleado)
        {
            bool res = false;

            string strConn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();

            using (SqlConnection conn = new SqlConnection(strConn))
            {
                SqlCommand checkCmd = conn.CreateCommand();
                checkCmd.CommandText = "SELECT COUNT(*) FROM empleados WHERE pin = @pin";
                checkCmd.Parameters.AddWithValue("@pin", empleado.pin);

                try
                {
                    conn.Open();
                    int existingUsersCount = (int)checkCmd.ExecuteScalar();

                    if (existingUsersCount > 0)
                    {
                        // El PIN ya existe, no se puede agregar el usuario
                        Console.WriteLine("Ya existe un usuario con el mismo PIN.");
                        return false;
                    }

                    // El PIN no existe agrega al db
                    SqlCommand cmd = conn.CreateCommand();
                    cmd.CommandText = "INSERT INTO empleados (cuil, nombre_completo, pin, role) VALUES (@cuil, @nombre_completo, @pin, @role)";

                    cmd.Parameters.AddWithValue("@cuil", empleado.cuil);
                    cmd.Parameters.AddWithValue("@nombre_completo", empleado.nombre_completo);
                    cmd.Parameters.AddWithValue("@pin", empleado.pin);
                    cmd.Parameters.AddWithValue("@role", empleado.role);

                    cmd.ExecuteNonQuery();
                    res = true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    res = false;
                    throw;
                }
                finally
                {
                    checkCmd.Parameters.Clear();
                    conn.Close();
                }

                return res;
            }
        }


        public List<Empleado> GetByCuil(long cuil)
        {
            List<Empleado> lista = new List<Empleado>();
            string strConn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();
            string queryString = "SELECT * FROM empleados WHERE cuil = @Cuil";

            using (SqlConnection conn = new SqlConnection(strConn))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(queryString, conn);
                cmd.Parameters.AddWithValue("@Cuil", cuil);

                SqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    long cuilValue = dr.GetInt64(0);
                    string nombre_completo = dr.GetString(1).Trim();
                    string pin = dr.GetString(2).Trim();
                    string role = dr.GetString(3).Trim();

                    Empleado empleado = new Empleado((long)cuilValue, nombre_completo, pin, role);
                    lista.Add(empleado);
                }
                dr.Close();
                conn.Close();
            }

            return lista;
        }

        public bool DeleteByCuil(string cuil)
        {
            string strConn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();
            string queryString = "DELETE FROM empleados WHERE cuil = @Cuil";

            using (SqlConnection conn = new SqlConnection(strConn))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(queryString, conn);
                cmd.Parameters.AddWithValue("@Cuil", cuil);

                int rowsAffected = cmd.ExecuteNonQuery();

                if (rowsAffected > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }



        public bool UpdateEmployee(long selectedcuil, Empleado empleado)
        {
            bool res = false;

            string strConn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();

            using (SqlConnection conn = new SqlConnection(strConn))
            {
                SqlCommand cmd = conn.CreateCommand();

                cmd.CommandText = "UPDATE empleados SET nombre_completo = @nombre_completo, pin = @pin, role = @rol  WHERE cuil = @selectedCuil";

                cmd.Parameters.AddWithValue("@selectedcuil", selectedcuil);
                cmd.Parameters.AddWithValue("@nombre_completo", empleado.nombre_completo);
                cmd.Parameters.AddWithValue("@pin", empleado.pin);
                cmd.Parameters.AddWithValue("@role", empleado.role);

                try
                {
                    conn.Open();
                    cmd.ExecuteNonQuery();
                    res = true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    res = false;
                    throw;
                }
                finally
                {
                    cmd.Parameters.Clear();
                    conn.Close();
                }

                return res;
            }
        }

    }
}