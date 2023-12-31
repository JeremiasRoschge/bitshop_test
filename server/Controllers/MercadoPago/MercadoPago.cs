using System.Collections.Generic;

public class ProductData
{
    public class CashOutData
    {
        public int amount { get; set; }
    }

    public class ItemData
    {
        public string sku_number { get; set; }
        public string category { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public decimal unit_price { get; set; }
        public int quantity { get; set; }
        public string unit_measure{ get; set; }
        public decimal total_amount { get; set; }
    }

    public class SponsorData
    {
        public int id { get; set; }
    }

    public CashOutData cash_out { get; set; }
    public string external_reference { get; set; }
    public List<ItemData> items { get; set; }
    public string notification_url { get; set; }
    public SponsorData sponsor { get; set; }
    public string title { get; set; }
    public string description { get; set; }
    public decimal total_amount{ get; set; }
}
