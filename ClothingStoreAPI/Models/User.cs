using System.ComponentModel.DataAnnotations;

namespace ClothingStoreAPI.Models
{   
    public enum UserRole
    {
        Customer,
        Admin
    }
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public UserRole Role { get; set; } = UserRole.Customer;

        public decimal Balance { get; set; } = 0; 
    }
}
