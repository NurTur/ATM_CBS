using System.ComponentModel.DataAnnotations;

namespace Pawnshop.Data.Models.Contracts.Actions
{
    public enum ContractActionType : short
    {
        [Display(Name = "Продление")]
        Prolong = 10,
        [Display(Name = "Выкуп")]
        Buyout = 20,
        [Display(Name = "Частичный выкуп")]
        PartialBuyout = 30,
        [Display(Name = "Частичное погашение")]
        PartialPayment = 40,
        [Display(Name = "Выдача")]
        Sign = 50,
        [Display(Name = "Отправка на реализацию")]
        Selling = 60,
        [Display(Name = "Передача")]
        Transfer = 70,
        [Display(Name = "Ежемесячное погашение")]
        MonthlyPayment = 80,
        [Display(Name = "Добор")]
        Addition = 90
    }
}