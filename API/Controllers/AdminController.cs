using API.DTOs;
using API.Extensions;
using API.RequestHelpers;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers
{

    [Authorize(Roles = "Admin")]
    public class AdminController(StoreContext _context, IUnitOfWork unit, IPaymentService paymentService, UserManager<AppUser> userManager) : BaseApiController
    {
        [HttpGet("orders")]
        public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetOrders([FromQuery] OrderSpecParams specParams)
        {
            var spec = new OrderSpecification(specParams);
            return await CreatePagedResult(unit.Repository<Order>(), spec, specParams.PageIndex, specParams.PageSize, o => o.ToDto());
        }


        [HttpGet("orders/{id:int}")]
        public async Task<ActionResult<OrderDto>> GetOrderById(int id)
        {
            var spec = new OrderSpecification(id);

            var order = await unit.Repository<Order>().GetEntityWithSpec(spec);

            if (order == null) return BadRequest("No order with that id");

            return order.ToDto();
        }

        [HttpPost("orders/refund/{id:int}")]
        public async Task<ActionResult<OrderDto>> RefundOrder(int id)
        {
            var spec = new OrderSpecification(id);

            var order = await unit.Repository<Order>().GetEntityWithSpec(spec);

            if (order == null) return BadRequest("No order with that id");

            if (order.Status == OrderStatus.Pending)
                return BadRequest("Payment not received for this order");

            var result = await paymentService.RefundPayment(order.PaymentIntentId);

            if (result == "succeeded")
            {
                order.Status = OrderStatus.Refunded;

                await unit.Complete();

                return order.ToDto();
            }

            return BadRequest("Problem refunding order");
        }

        // [HttpGet("users")]
        //         public async Task<ActionResult<Pagination<UserDto>>> GetUsers([FromQuery] UserSpecParams specParams)
        //         {
        //             var users = userManager.Users.OrderBy(o => o.Email).ToList();
        //             var userList = new List<UserDto>();

        //             foreach (var user in users)
        //             {
        //                 var roles = await userManager.GetRolesAsync(user); // Fetch roles separately
        //                 if (string.IsNullOrEmpty(specParams.Role) || specParams.Role == "All" || roles.Contains(specParams.Role))
        //                 {
        //                     userList.Add(new UserDto
        //                     {
        //                         Id = user.Id,
        //                         FirstName = user.FirstName,
        //                         LastName = user.LastName,
        //                         Email = user.Email,
        //                         Address = user.Address?.ToDto(), // Avoid null reference
        //                         Roles = roles.ToList()[0] // Convert roles to list
        //                     });
        //                 }
        //             }

        //             var totalCount = userList.Count;

        //             var pagination = new Pagination<UserDto>(specParams.PageIndex, specParams.PageSize, totalCount, userList.Skip((specParams.PageIndex - 1) * specParams.PageSize)
        //                 .Take(specParams.PageSize).ToList());

        //             return Ok(pagination);
        //         }

        [HttpGet("userslist")]
        public async Task<ActionResult<List<UserDto>>> GetUsers()
        {
            var users = userManager.Users.OrderBy(o => o.Email).ToList();
            var userList = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user); // Fetch roles separately
                // if (string.IsNullOrEmpty(specParams.Role) || specParams.Role == "All" || roles.Contains(specParams.Role))
                {
                    userList.Add(new UserDto
                    {
                        Id = user.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        Address = user.Address?.ToDto(), // Avoid null reference
                        Roles = roles.ToList()[0] // Convert roles to list
                    });
                }
            }

            // var totalCount = userList.Count;

            // var pagination = new Pagination<UserDto>(specParams.PageIndex, specParams.PageSize, totalCount, userList.Skip((specParams.PageIndex - 1) * specParams.PageSize)
            //     .Take(specParams.PageSize).ToList());
            // System.Console.WriteLine("-------------------------------------------------------------------------");
            // System.Console.WriteLine(userList);
            // System.Console.WriteLine("-------------------------------------------------------------------------");
            return Ok(userList);
        }

        [HttpDelete("users/{id}")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            Console.WriteLine($"Attempting to delete user with ID: {id}");

            var user = await userManager.FindByIdAsync(id);

            if (user == null)
            {
                Console.WriteLine("User not found");
                return NotFound("User not found");
            }

            var result = await userManager.DeleteAsync(user);

            if (result.Succeeded)
            {
                Console.WriteLine("User deleted successfully");
                return NoContent();
            }

            Console.WriteLine("Problem deleting the user");
            return BadRequest("Problem deleting the user");
        }

        [HttpPost("users")]
        public async Task<ActionResult> CreateUser(AdminCreateUserDto adminCreateUserDto)
        {
            // Check if email is already taken
            var existingUser = await userManager.FindByEmailAsync(adminCreateUserDto.Email);
            if (existingUser != null)
            {
                return BadRequest("Email is already in use.");
            }
            var user = new AppUser
            {
                FirstName = adminCreateUserDto.FirstName,
                LastName = adminCreateUserDto.LastName,
                Email = adminCreateUserDto.Email,
                UserName = adminCreateUserDto.Email
            };

            var result = await userManager.CreateAsync(user, adminCreateUserDto.Password);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }
            else
            {
                await userManager.AddToRoleAsync(user, adminCreateUserDto.Role);
            }

            return Ok();
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<UserDto>> GetUserById(string id)
        {
            var user = await userManager.FindByIdAsync(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            var roles = await userManager.GetRolesAsync(user);

            var userDto = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Address = user.Address != null ? user.Address.ToDto() : null, // Null check
                Roles = roles.ToList()[0]
            };

            return Ok(userDto);
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> EditUser(string id, [FromBody] UserDto model)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null) return NotFound("User not found");

            // Update user fields
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Email = model.Email;
            user.UserName = model.Email;

            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);

            // If role is updated
            var currentRoles = await userManager.GetRolesAsync(user);
            if (model.Roles != null && !currentRoles.Contains(model.Roles))
            {
                await userManager.RemoveFromRolesAsync(user, currentRoles);
                await userManager.AddToRoleAsync(user, model.Roles);
            }

            return Ok();
        }

        private static OrderStatus? ParseStatus(string status)
        {
            if (Enum.TryParse<OrderStatus>(status, true, out var result)) return result;
            return null;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardData()
        {
            var totalUsers = await userManager.Users.CountAsync(); // Uses Identity API
            var totalProducts = await _context.Products.CountAsync();
            var totalOrders = await _context.Orders.CountAsync();
            var totalSales = await _context.Orders
                                           .Where(o => o.Status == OrderStatus.PaymentReceived)
                                           .SumAsync(o => o.Subtotal);
            var recentProducts = await _context.Products
                                    .OrderByDescending(p => p.Id)
                                    .Take(5)
                                    .Select(p => new
                                    {
                                        p.Id,
                                        p.Name,
                                        p.Price,
                                        p.Brand,
                                        p.Type
                                    })
                                    .ToListAsync();

            var recentOrders = await _context.Orders
                            .OrderByDescending(o => o.OrderDate)
                            .Take(5)
                            .Select(o => new
                            {
                                o.Id,
                                o.BuyerEmail,
                                TotalAmount = o.DeliveryMethod.Price + o.Subtotal,
                                Status = o.Status.ToString() // Convert enum to string
                            })
                            .ToListAsync();




            var recentPayments = await _context.Orders
                .Where(o => o.Status == OrderStatus.PaymentReceived)
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .Select(o => new
                {
                    o.Id,
                    o.BuyerEmail,
                    AmountPaid = o.DeliveryMethod.Price + o.Subtotal,
                })
                .ToListAsync();

            var topCustomers = await _context.Orders
                .Where(o => o.Status == OrderStatus.PaymentReceived)
                .GroupBy(o => o.BuyerEmail)
                .Select(g => new
                {
                    Customer = g.Key,
                    TotalSpent = g.Sum(o => o.DeliveryMethod.Price + o.Subtotal)
                })
                .OrderByDescending(c => c.TotalSpent)
                .Take(5)
                .ToListAsync();

            // ✅ Return response as JSON
            return Ok(new
            {
                TotalUsers = totalUsers,
                TotalProducts = totalProducts,
                TotalOrders = totalOrders,
                TotalSales = totalSales,
                RecentOrders = recentOrders,
                RecentProducts = recentProducts,
                RecentPayments = recentPayments,
                TopCustomers = topCustomers
            });
        }
    }

}
