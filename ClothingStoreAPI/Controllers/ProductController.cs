using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClothingStoreAPI.Data;
using ClothingStoreAPI.Models;
using Microsoft.AspNetCore.Authorization;

namespace ClothingStoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return product;
        }

        // GET: api/products/stock-report?type=Sweater&size=M - Отчет по остаткам
        [HttpGet("stock-report")]
        public async Task<ActionResult<IEnumerable<Product>>> GetStockReport(
            [FromQuery] ProductType? type,
            [FromQuery] string? size)
        {
            var query = _context.Products.AsQueryable();

            if (type.HasValue)
                query = query.Where(p => p.Type == type.Value);

            if (!string.IsNullOrEmpty(size))
                query = query.Where(p => p.Size == size);

            return await query.ToListAsync();
        }

        // POST: api/products - Создать новый товар (только админ)
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {   
            if (!User.IsInRole("Admin"))
            {
                return Forbid();
            }
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        // PUT: api/products/5/restock - Пополнить склад
        [HttpPut("{id}/restock")]
        public async Task<IActionResult> RestockProduct(int id, [FromBody] int quantity)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.Quantity += quantity;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/products/5 - Обновить товар
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, Product product)
        {
            if (id != product.Id) return BadRequest();

            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/products/5 - Удалить товар
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}