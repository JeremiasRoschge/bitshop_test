namespace server.Models
{
    public class Producto
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public int precio { get; set; }
        public int stock { get; set; }
        public string imagenUrl { get; set; }  // Nueva propiedad para la URL de la imagen

        public Producto() { }

        public Producto(int ID, string Nombre, int Precio, int Stock, string ImagenUrl)
        {
            id = ID;
            nombre = Nombre;
            precio = Precio;
            stock = Stock;
            imagenUrl = ImagenUrl;
        }
    }
}
