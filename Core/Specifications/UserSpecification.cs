using System;
using Core.Entities;

namespace Core.Specifications;

public class UserSpecification : BaseSpecification<AppUser>
{
    public UserSpecification(UserSpecParams specParams)
    {
        AddInclude("Address");
        // AddInclude("DeliveryMethod");
        ApplyPaging(specParams.PageSize * (specParams.PageIndex - 1), specParams.PageSize);
        // AddOrderByDescending(x => x.OrderDate);
    }

}
