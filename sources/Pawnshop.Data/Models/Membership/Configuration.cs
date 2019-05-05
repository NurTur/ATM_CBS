using System;
using Pawnshop.Data.CustomTypes;
using Pawnshop.Data.Models.Contracts;

namespace Pawnshop.Data.Models.Membership
{
    public class Configuration : IJsonObject
    {
        /// <summary>
        /// Юридический статус
        /// </summary>
        public LegalSettings LegalSettings { get; set; }
        /// <summary>
        /// Контактная информация
        /// </summary>
        public ContactSettings ContactSettings { get; set; }
        /// <summary>
        /// Банковские реквизиты
        /// </summary>
        public BankSettings BankSettings { get; set; }
        /// <summary>
        /// Профиль договора по умолчанию
        /// </summary>
        public ContractSettings ContractSettings { get; set; }

        /// <summary>
        /// Профиль ПКО/РКО по умолчанию
        /// </summary>
        public CashOrderSettings CashOrderSettings { get; set; }
    }

    public class CashOrderSettings
    {
        /// <summary>
        /// Код для номера ПКО
        /// </summary>
        public string CashInNumberCode { get; set; }

        /// <summary>
        /// Код для номера РКО
        /// </summary>
        public string CashOutNumberCode { get; set; }

        /// <summary>
        /// Счет кассы
        /// </summary>
        public int? CashAccountId { get; set; }

        /// <summary>
        /// Настройки для золота
        /// </summary>
        public CollateralSettings GoldCollateralSettings { get; set; }

        /// <summary>
        /// Настройки для товаров
        /// </summary>
        public CollateralSettings GoodCollateralSettings { get; set; }

        /// <summary>
        /// Настройки для автомобилей
        /// </summary>
        public CollateralSettings CarCollateralSettings { get; set; }

        /// <summary>
        /// Настройки для спецтехники
        /// </summary>
        public CollateralSettings MachineryCollateralSettings { get; set; }

        /// <summary>
        /// Настройки для передачи автомобилей
        /// </summary>
        public TransferSettings CarTransferSettings { get; set; }

        /// <summary>
        /// Настройки для страхового договора
        /// </summary>
        public InsuranceSettings InsuranceSettings { get; set; }

        public CollateralSettings Get(CollateralType collateralType)
        {
            switch (collateralType)
            {
                case CollateralType.Gold:
                    return GoldCollateralSettings;
                case CollateralType.Car:
                    return CarCollateralSettings;
                case CollateralType.Goods:
                    return GoodCollateralSettings;
                case CollateralType.Machinery:
                    return MachineryCollateralSettings;
                default:
                    throw new ArgumentOutOfRangeException(nameof(collateralType), collateralType, null);
            }
        }
    }

    public class CollateralSettings
    {
        /// <summary>
        /// Настройки для выдачи
        /// </summary>
        public AccountSettings SupplySettings { get; set; }

        /// <summary>
        /// Настройки для долга
        /// </summary>
        public AccountSettings DebtSettings { get; set; }

        /// <summary>
        /// Настройки для пошлина
        /// </summary>
        public AccountSettings LoanSettings { get; set; }

        /// <summary>
        /// Настройки для штрафа
        /// </summary>
        public AccountSettings PenaltySettings { get; set; }

        /// <summary>
        /// Настройки для отправки реализации
        /// </summary>
        public AccountSettings SellingSettings { get; set; }

        /// <summary>
        /// Настройки для реализации
        /// </summary>
        public AccountSettings DisposeSettings { get; set; }
    }

    public class TransferSettings
    {
        /// <summary>
        /// Настройки для долга при передаче
        /// </summary>
        public AccountSettings SupplyDebtSettings { get; set; }

        /// <summary>
        /// Настройки для пошлина при передаче
        /// </summary>
        public AccountSettings SupplyLoanSettings { get; set; }

        /// <summary>
        /// Настройки для штрафа при передаче
        /// </summary>
        public AccountSettings SupplyPenaltySettings { get; set; }        

        /// <summary>
        /// Настройки для долга
        /// </summary>
        public AccountSettings DebtSettings { get; set; }

        /// <summary>
        /// Настройки для пошлина
        /// </summary>
        public AccountSettings LoanSettings { get; set; }

        /// <summary>
        /// Настройки для штрафа
        /// </summary>
        public AccountSettings PenaltySettings { get; set; }        
    }

    public class InsuranceSettings
    {
        /// <summary>
        /// Настройки при подписании страхового договора
        /// </summary>
        public AccountSettings SignSettings { get; set; }
    }

    public class LegalSettings
    {
        /// <summary>
        /// Наименование организации
        /// </summary>
        public string LegalName { get; set; }

        /// <summary>
        /// ОКУД
        /// </summary>
        public string OKUD { get; set; }
        /// <summary>
        /// ОКПО
        /// </summary>
        public string OKPO { get; set; }
        /// <summary>
        /// РНН
        /// </summary>
        public string RNN { get; set; }
        /// <summary>
        /// БИН
        /// </summary>
        public string BIN { get; set; }
        /// <summary>
        /// Директор
        /// </summary>
        public string ChiefName { get; set; }
        /// <summary>
        /// Главный бухгалтер
        /// </summary>
        public string ChiefAccountantName { get; set; }
        /// <summary>
        /// Бухгалтер
        /// </summary>
        public string AccountantName { get; set; }
        /// <summary>
        /// Кассир
        /// </summary>
        public string CashierName { get; set; }
    }

    public class ContactSettings
    {
        /// <summary>
        /// Город
        /// </summary>
        public string City { get; set; }

        /// <summary>
        /// Адрес
        /// </summary>
        public string Address { get; set; }
        /// <summary>
        /// Телефон
        /// </summary>
        public string Phone { get; set; }
        /// <summary>
        /// Режим работы
        /// </summary>
        public string Schedule { get; set; }
    }

    public class ContractSettings
    {
        /// <summary>
        /// Код для номера договора
        /// </summary>
        public string NumberCode { get; set; }
    }

    public class AccountSettings
    {
        /// <summary>
        /// Ссылка на счет Дебет
        /// </summary>
        public int? DebitId { get; set; }

        /// <summary>
        /// Ссылка на счет Кредит
        /// </summary>
        public int? CreditId { get; set; }
    }

    public class BankSettings
    {
        /// <summary>
        /// Наименование
        /// </summary>
        public string BankName { get; set; }
        /// <summary>
        /// Счет
        /// </summary>
        public string BankAccount { get; set; }
        /// <summary>
        /// Кбе
        /// </summary>
        public string BankKbe { get; set; }
        /// <summary>
        /// БИК
        /// </summary>
        public string BankBik { get; set; }
    }
}