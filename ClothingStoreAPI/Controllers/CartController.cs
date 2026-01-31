using ClothingStoreAPI.Data;
using ClothingStoreAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace ClothingStoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<CartItem>>> GetUserCart(int userId)
        {
            return await _context.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == userId)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<CartItem>> AddToCart([FromBody] AddToCartDto cartDto)
        {
            var product = await _context.Products.FindAsync(cartDto.ProductId);
            if (product == null)
                return NotFound($"Товар с ID {cartDto.ProductId} не найден");

            if (product.Quantity < cartDto.Quantity)
                return BadRequest($"Недостаточно товара на складе. В наличии: {product.Quantity} шт.");

            var user = await _context.Users.FindAsync(cartDto.UserId);
            if (user == null)
                return NotFound($"Пользователь с ID {cartDto.UserId} не найден");

            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == cartDto.UserId && c.ProductId == cartDto.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += cartDto.Quantity;

                if (product.Quantity < existingItem.Quantity)
                    return BadRequest($"Максимальное количество: {product.Quantity} шт.");
            }
            else
            {
                var cartItem = new CartItem
                {
                    UserId = cartDto.UserId,
                    ProductId = cartDto.ProductId,
                    Quantity = cartDto.Quantity,
                    AddedAt = DateTime.UtcNow
                };

                _context.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();

            var cartItems = await _context.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == cartDto.UserId)
                .ToListAsync();

            return Ok(cartItems);
        }

        [HttpPost("simple")]
        public async Task<ActionResult> AddToCartSimple([FromBody] AddToCartDto cartDto)
        {
            var product = await _context.Products.FindAsync(cartDto.ProductId);
            if (product == null || product.Quantity < cartDto.Quantity)
                return BadRequest("Товар отсутствует или недостаточно на складе");

            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == cartDto.UserId && c.ProductId == cartDto.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += cartDto.Quantity;
            }
            else
            {
                var cartItem = new CartItem
                {
                    UserId = cartDto.UserId,
                    ProductId = cartDto.ProductId,
                    Quantity = cartDto.Quantity,
                    AddedAt = DateTime.UtcNow
                };

                _context.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Товар добавлен в корзину" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null) return NotFound();

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<ActionResult<CartItem>> GetCartItem(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null) return NotFound();
            return cartItem;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCartItem(int id, [FromBody] UpdateCartItemDto updateDto)
        {
            var cartItem = await _context.CartItems
                .Include(c => c.Product)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cartItem == null)
                return NotFound("Элемент корзины не найден");

            var product = cartItem.Product;
            if (product == null)
                return NotFound("Товар не найден");

            if (updateDto.Quantity > product.Quantity)
                return BadRequest($"Недостаточно товара на складе. В наличии: {product.Quantity} шт.");

            if (updateDto.Quantity <= 0)
            {
                _context.CartItems.Remove(cartItem);
            }
            else
            {
                cartItem.Quantity = updateDto.Quantity;
            }

            await _context.SaveChangesAsync();

            var cartItems = await _context.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == cartItem.UserId)
                .ToListAsync();

            return Ok(cartItems);
        }

        [HttpPut("{id}/quantity")]
        public async Task<IActionResult> UpdateCartItemQuantity(int id, [FromBody] int quantity)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null)
                return NotFound("Элемент корзины не найден");

            if (quantity <= 0)
            {
                _context.CartItems.Remove(cartItem);
            }
            else
            {
                var product = await _context.Products.FindAsync(cartItem.ProductId);
                if (product == null)
                    return NotFound("Товар не найден");

                if (quantity > product.Quantity)
                    return BadRequest($"Максимальное количество: {product.Quantity} шт.");

                cartItem.Quantity = quantity;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Количество обновлено" });
        }

        public class UpdateCartItemDto
        {
            [Required]
            [Range(0, int.MaxValue, ErrorMessage = "Количество должно быть положительным числом")]
            public int Quantity { get; set; }
        }
    }

}