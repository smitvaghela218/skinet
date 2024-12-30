using System;
using Core.Entities.OrderAggregate;

namespace Core.Specifications;

public class OrderSpecification : BaseSpecification<Order>
{
    public OrderSpecification(String email) : base(x => x.BuyerEmail == email)
    {
        AddInclude(x => x.DeliveryMethod);
        AddInclude(x => x.OrderItems);
        AddOrderByDescending(x => x.OrderDate);
    }

    public OrderSpecification(String email, int id) : base(x => x.BuyerEmail == email && x.Id == id)
    {
        // AddInclude(x => x.DeliveryMethod);
        // AddInclude(x => x.OrderItems);

        //or

        AddInclude("DeliveryMethod");
        AddInclude("OrderItems");

        // AddInclude("OrderItems.Product.Category")
    }
}
