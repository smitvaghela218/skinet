using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Interfaces;

public interface ISpecification<T>
{
    Expression<Func<T, bool>>? Criteria { get; }
    // here we have to pass this expression to specification evaluator so write the get;
    Expression<Func<T, Object>>? OrderBy { get; }
    Expression<Func<T, Object>>? OrderByDescending { get; }
    bool IsDistinct { get; }
    int Take { get; }
    int Skip { get; }
    bool IsPagingEnabled { get; }
    IQueryable<T> ApplyCriteria(IQueryable<T> query);
}

public interface ISpecification<T, TResult> : ISpecification<T>
{
    Expression<Func<T, TResult>>? Select { get; }
}