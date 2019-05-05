using System;
using Pawnshop.Core;

namespace Pawnshop.Data.Models.Audit
{
    public class EventLogItem : IEntity
    {
        public int Id { get; set; }

        public EventCode EventCode { get; set; }

        public EventStatus EventStatus { get; set; }

        public int? UserId { get; set; }

        public string UserName { get; set; }

        public int? BranchId { get; set; }

        public string BranchName { get; set; }

        public string Uri { get; set; }

        public string Address { get; set; }

        public EntityType? EntityType { get; set; }

        public int? EntityId { get; set; }

        public string RequestData { get; set; }

        public string ResponseData { get; set; }

        public DateTime CreateDate { get; set; }

        public string EventDescription
        {
            get
            {
                switch (EventCode)
                {
                    case EventCode.UserAuthentication:
                        return "Авторизация пользователя";
                    case EventCode.UserPasswordSaved:
                        return "Изменение пароля пользователя";
                    case EventCode.UserProfileSaved:
                        return "Изменение профиля пользователя";
                    case EventCode.OrganizationConfigSaved:
                        return "Изменение конфигурации организации";
                    case EventCode.BranchConfigSaved:
                        return "Изменение конфигурации филиала";
                    case EventCode.FileUploaded:
                        return "Загрузка файла завершена";
                    case EventCode.DictAccountSaved:
                        return "Запись в справочнике \"Счета\" сохранена";
                    case EventCode.DictAccountDeleted:
                        return "Запись в справочнике \"Счета\" удалена";
                    case EventCode.DictAccountRecovery:
                        return "Запись в справочнике \"Счета\" восстановлена";
                    case EventCode.DictCarSaved:
                        return "Запись в справочнике \"Автомобили\" сохранена";
                    case EventCode.DictCarDeleted:
                        return "Запись в справочнике \"Автомобили\" удалена";
                    case EventCode.DictCarRecovery:
                        return "Запись в справочнике \"Автомобили\" восстановлена";
                    case EventCode.DictCategorySaved:
                        return "Запись в справочнике \"Категории\" сохранена";
                    case EventCode.DictCategoryDeleted:
                        return "Запись в справочнике \"Категории\" удалена";
                    case EventCode.DictCategoryRecovery:
                        return "Запись в справочнике \"Категории\" восстановлена";
                    case EventCode.DictGoldSaved:
                        return "Запись в справочнике \"Золото\" сохранена";
                    case EventCode.DictGoldDeleted:
                        return "Запись в справочнике \"Золото\" удалена";
                    case EventCode.DictGoldRecovery:
                        return "Запись в справочнике \"Золото\" восстановлена";
                    case EventCode.DictGoodSaved:
                        return "Запись в справочнике \"Товары\" сохранена";
                    case EventCode.DictGoodDeleted:
                        return "Запись в справочнике \"Товары\" удалена";
                    case EventCode.DictGoodRecovery:
                        return "Запись в справочнике \"Товары\" восстановлена";
                    case EventCode.DictPuritySaved:
                        return "Запись в справочнике \"Пробы\" сохранена";
                    case EventCode.DictPurityDeleted:
                        return "Запись в справочнике \"Пробы\" удалена";
                    case EventCode.DictPurityRecovery:
                        return "Запись в справочнике \"Пробы\" восстановлена";
                    case EventCode.DictLoanPercentSaved:
                        return "Запись в справочнике \"Проценты\" сохранена";
                    case EventCode.DictLoanPercentDeleted:
                        return "Запись в справочнике \"Проценты\" удалена";
                    case EventCode.DictLoanPercentRecovery:
                        return "Запись в справочнике \"Проценты\" восстановлена";
                    case EventCode.DictMachinerySaved:
                        return "Запись в справочнике \"Спецтехника\" сохранена";
                    case EventCode.DictMachineryDeleted:
                        return "Запись в справочнике \"Спецтехника\" удалена";
                    case EventCode.GroupSaved:
                        return "Запись в таблице \"Группы\" сохранена";
                    case EventCode.GroupDeleted:
                        return "Запись в таблице \"Группы\" удалена";
                    case EventCode.GroupRecovery:
                        return "Запись в таблице \"Группы\" восстановлена";
                    case EventCode.UserSaved:
                        return "Запись в таблице \"Пользователи\" сохранена";
                    case EventCode.UserDeleted:
                        return "Запись в таблице \"Пользователи\" удалена";
                    case EventCode.UserRecovery:
                        return "Запись в таблице \"Пользователи\" восстановлена";
                    case EventCode.RoleSaved:
                        return "Запись в таблице \"Роли\" сохранена";
                    case EventCode.RoleDeleted:
                        return "Запись в таблице \"Роли\" удалена";
                    case EventCode.RoleRecovery:
                        return "Запись в таблице \"Роли\" восстановлена";
                    case EventCode.ClientSaved:
                        return "Запись в таблице \"Клиенты\" сохранена";
                    case EventCode.ClientDeleted:
                        return "Запись в таблице \"Клиенты\" удалена";
                    case EventCode.ClientRecovery:
                        return "Запись в таблице \"Клиенты\" восстановлена";
                    case EventCode.ContractSaved:
                        return "Договор сохранен";
                    case EventCode.ContractDeleted:
                        return "Договор удален";
                    case EventCode.ContractRecovery:
                        return "Договор восстановлен";
                    case EventCode.ContractActionCancel:
                        return "Действие отменено";
                    case EventCode.ContractActionRecovery:
                        return "Действие восстановлено";
                    case EventCode.ContractSelling:
                        return "Договор отправлен на реализацию";
                    case EventCode.ContractSign:
                        return "Договор подписан";
                    case EventCode.ContractProlong:
                        return "Договор продлен";
                    case EventCode.ContractBuyout:
                        return "Договор выкуплен";
                    case EventCode.ContractPartialBuyout:
                        return "Договор частично выкуплен";
                    case EventCode.ContractPartialPayment:
                        return "Договор частично погашен";
                    case EventCode.ContractNoteSaved:
                        return "Примечание к договору сохранено";
                    case EventCode.ContractNoteDeleted:
                        return "Примечание к договору удалено";
                    case EventCode.ContractTransferred:
                        return "Договор передан";
                    case EventCode.ContractMonthlyPayment:
                        return "Ежемесячное погашение договора";
                    case EventCode.CashOrderSaved:
                        return "Кассовый ордер сохранен";
                    case EventCode.CashOrderDeleted:
                        return "Кассовый ордер удален";
                    case EventCode.CashOrderRecovery:
                        return "Кассовый ордер восстановленн";
                    case EventCode.SellingSaved:
                        return "Позиция на реализации сохранена";
                    case EventCode.SellingDeleted:
                        return "Позиция на реализации удалена";
                    case EventCode.SellingRecovery:
                        return "Позиция на реализации восстановлена";
                    case EventCode.SellingSell:
                        return "Позиция на реализации продана";
                    case EventCode.SellingSellCancel:
                        return "Продажа позиции на реализации отменена";
                    case EventCode.ContractAddition:
                        return "Добор";
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }
    }
}