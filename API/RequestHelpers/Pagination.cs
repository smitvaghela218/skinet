using System;

namespace API.RequestHelpers;

public class Pagination<T>(int pageindex, int pageSize, int count, IReadOnlyList<T> data)
{
    public int PageIndex { get; set; } = pageindex;
    public int PageSize { get; set; } = pageSize;
    public int Count { get; set; } = count;
    public IReadOnlyList<T> Date { get; set; } = data;
}
