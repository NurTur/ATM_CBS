using System;
namespace Pawnshop.Web.Engine
{
    public static class DateTimeExtensions
    {
        public static int MonthDifference(this DateTime value, DateTime to)
        {
            return Math.Abs((value.Month - to.Month) + 12 * (value.Year - to.Year));
        }
    }
}
