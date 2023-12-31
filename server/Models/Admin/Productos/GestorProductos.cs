using server.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Http.Cors;

namespace server.Models
{
    
    public class GestorProducto
    {
        public List<Producto> GetProductos()
        {
            List<Producto> lista = new List<Producto>();
            string strConn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();
            string queryString = "SELECT * FROM productos";

            using (SqlConnection conn = new SqlConnection(strConn))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(queryString, conn);

                SqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    int id = dr.GetInt32(0);
                    string nombre = dr.GetString(1);
                    int stock = dr.GetInt32(2);
                    int precio = dr.GetInt32(3);
                    string imagenUrl = dr.GetString(4); 

                    Producto producto = new Producto((int)id, nombre, precio, stock, imagenUrl);
                    lista.Add(producto);
                }
                dr.Close();
                conn.Close();
            }

            return lista;
        }
        public List<Producto> GetById(int id)
        {
            List<Producto> lista = new List<Producto>();
            string strConn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();
            string queryString = "SELECT * FROM productos WHERE @id = ID";

            using (SqlConnection conn = new SqlConnection(strConn))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(queryString, conn);
                cmd.Parameters.AddWithValue("@ID", id);

                SqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    int idValue = dr.GetInt32(0);
                    string nombre = dr.GetString(1);
                    int stock = dr.GetInt32(2);
                    int precio = dr.GetInt32(3);
                    string imagenUrl = dr.GetString(4);


                    Producto producto = new Producto((int)idValue, nombre, precio, stock, imagenUrl);
                    lista.Add(producto);

                }
                dr.Close();
                conn.Close();
            }

            return lista;
        }
        public bool DeleteByID(int id)
        {
            string strConn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();
            string queryString = "DELETE FROM productos WHERE id = @Id";

            using (SqlConnection conn = new SqlConnection(strConn))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(queryString, conn);
                cmd.Parameters.AddWithValue("@Id", id);

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
        public bool UpdateProducto(int SelectedID, Producto producto)
        {
            bool res = false;

            string strConn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();

            using (SqlConnection conn = new SqlConnection(strConn))
            {
                SqlCommand cmd = conn.CreateCommand();

                cmd.CommandText = "UPDATE productos SET nombre= @nombre, precio = @precio, stock = @stock, imagenUrl = @imagenUrl WHERE id = @SelectedID";

                cmd.Parameters.AddWithValue("@nombre", producto.nombre);
                cmd.Parameters.AddWithValue("@precio", producto.precio);
                cmd.Parameters.AddWithValue("@stock", producto.stock);
                cmd.Parameters.AddWithValue("@imagenUrl", producto.imagenUrl);
                cmd.Parameters.AddWithValue("@SelectedID", SelectedID);

                try
                {
                    conn.Open();
                    cmd.ExecuteNonQuery();
                    res = true;
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Trace.WriteLine($"Error al actualizar producto. Mensaje: {ex.Message}");

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

        public bool addProducto(Producto producto)
        {
            bool res = false;

            string strConn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();

            using (SqlConnection conn = new SqlConnection(strConn))
            {
                SqlCommand cmd = conn.CreateCommand();

                cmd.CommandText = "INSERT INTO productos  (nombre, stock, precio, imagenUrl) VALUES (@nombre, @stock, @precio, @imagenUrl)";

                cmd.Parameters.AddWithValue("@id", producto.id);
                cmd.Parameters.AddWithValue("@nombre", producto.nombre);
                cmd.Parameters.AddWithValue("@stock", producto.stock);
                cmd.Parameters.AddWithValue("@precio", producto.precio);
                cmd.Parameters.AddWithValue("@imagenUrl", producto.imagenUrl);

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
