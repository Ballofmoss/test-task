using System.ComponentModel.DataAnnotations;

namespace ClothingStoreAPI.Models
{   
    public enum ProductType
    {
        Sweater,
        Pants,
        Shorts,
        TShirt,
        Jacket
    }
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Barcode { get; set; } = string.Empty;

        [Required]
        public decimal Price { get; set; }

        [Required]
        public string Color { get; set; } = string.Empty;
        [Required]
        public string Size { get; set; } = string.Empty; 

        [Required]
        public ProductType Type { get; set; }

        [Required]
        public int Quantity { get; set; } 

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
