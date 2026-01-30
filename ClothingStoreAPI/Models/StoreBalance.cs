namespace ClothingStoreAPI.Models
{
    public class StoreBalance
    {
        public int Id { get; set; }
        public decimal Balance { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
    }
}
