using System.ComponentModel.DataAnnotations;

namespace Pawnshop.Data.Models.Audit
{
    /// <summary>
    /// Виды событий
    /// </summary>
    /// <remarks>Добавлять только в конец каждой группы</remarks>
    public enum EventCode
    {
        // common
        [Display(Name = "Авторизация пользователя")]
        UserAuthentication = 1,
        [Display(Name = "Изменение пароля пользователя")]
        UserPasswordSaved,
        [Display(Name = "Изменение профиля пользователя")]
        UserProfileSaved,
        [Display(Name = "Изменение конфигурации организации")]
        OrganizationConfigSaved,
        [Display(Name = "Изменение конфигурации филиала")]
        BranchConfigSaved,
        [Display(Name = "Загрузка файла завершена")]
        FileUploaded,
        // dicts
        [Display(Name = "Запись в справочнике \"Счета\" сохранена")]
        DictAccountSaved = 100,
        [Display(Name = "Запись в справочнике \"Счета\" удалена")]
        DictAccountDeleted,
        [Display(Name = "Запись в справочнике \"Счета\" восстановлена")]
        DictAccountRecovery,
        [Display(Name = "Запись в справочнике \"Автомобили\" сохранена")]
        DictCarSaved,
        [Display(Name = "Запись в справочнике \"Автомобили\" удалена")]
        DictCarDeleted,
        [Display(Name = "Запись в справочнике \"Автомобили\" восстановлена")]
        DictCarRecovery,
        [Display(Name = "Запись в справочнике \"Категории\" сохранена")]
        DictCategorySaved,
        [Display(Name = "Запись в справочнике \"Категории\" удалена")]
        DictCategoryDeleted,
        [Display(Name = "Запись в справочнике \"Категории\" восстановлена")]
        DictCategoryRecovery,
        [Display(Name = "Запись в справочнике \"Золото\" сохранена")]
        DictGoldSaved,
        [Display(Name = "Запись в справочнике \"Золото\" удалена")]
        DictGoldDeleted,
        [Display(Name = "Запись в справочнике \"Золото\" восстановлена")]
        DictGoldRecovery,
        [Display(Name = "Запись в справочнике \"Товары\" сохранена")]
        DictGoodSaved,
        [Display(Name = "Запись в справочнике \"Товары\" удалена")]
        DictGoodDeleted,
        [Display(Name = "Запись в справочнике \"Товары\" восстановлена")]
        DictGoodRecovery,
        [Display(Name = "Запись в справочнике \"Пробы\" сохранена")]
        DictPuritySaved,
        [Display(Name = "Запись в справочнике \"Пробы\" удалена")]
        DictPurityDeleted,
        [Display(Name = "Запись в справочнике \"Пробы\" восстановлена")]
        DictPurityRecovery,
        [Display(Name = "Запись в справочнике \"Проценты\" сохранена")]
        DictLoanPercentSaved,
        [Display(Name = "Запись в справочнике \"Проценты\" удалена")]
        DictLoanPercentDeleted,
        [Display(Name = "Запись в справочнике \"Проценты\" восстановлена")]
        DictLoanPercentRecovery,
        [Display(Name = "Запись в справочнике \"Спецтехника\" сохранена")]
        DictMachinerySaved,
        [Display(Name = "Запись в справочнике \"Спецтехника\" удалена")]
        DictMachineryDeleted,
        [Display(Name = "Запись в справочнике \"Причины добавления пользователя в черный список\" сохранена")]
        DictClientBlackListReasonSaved,
        [Display(Name = "Запись в справочнике \"Причины добавления пользователя в черный список\" удалена")]
        DictClientBlackListReasonDeleted,
        // membership
        [Display(Name = "Запись в таблице \"Группы\" сохранена")]
        GroupSaved = 200,
        [Display(Name = "Запись в таблице \"Группы\" удалена")]
        GroupDeleted,
        [Display(Name = "Запись в таблице \"Группы\" восстановлена")]
        GroupRecovery,
        [Display(Name = "Запись в таблице \"Пользователи\" сохранена")]
        UserSaved,
        [Display(Name = "Запись в таблице \"Пользователи\" удалена")]
        UserDeleted,
        [Display(Name = "Запись в таблице \"Пользователи\" восстановлена")]
        UserRecovery,
        [Display(Name = "Запись в таблице \"Роли\" сохранена")]
        RoleSaved,
        [Display(Name = "Запись в таблице \"Роли\" удалена")]
        RoleDeleted,
        [Display(Name = "Запись в таблице \"Роли\" восстановлена")]
        RoleRecovery,
        // business
        // clients
        [Display(Name = "Запись в таблице \"Клиенты\" сохранена")]
        ClientSaved = 300,
        [Display(Name = "Запись в таблице \"Клиенты\" удалена")]
        ClientDeleted,
        [Display(Name = "Запись в таблице \"Клиенты\" восстановлена")]
        ClientRecovery,
        // contracts
        [Display(Name = "Договор сохранен")]
        ContractSaved = 320,
        [Display(Name = "Договор удален")]
        ContractDeleted,
        [Display(Name = "Договор восстановлен")]
        ContractRecovery,
        [Display(Name = "Действие отменено")]
        ContractActionCancel,
        [Display(Name = "Действие восстановлено")]
        ContractActionRecovery,
        [Display(Name = "Договор отправлен на реализацию")]
        ContractSelling,
        [Display(Name = "Договор подписан")]
        ContractSign,
        [Display(Name = "Договор продлен")]
        ContractProlong,
        [Display(Name = "Договор выкуплен")]
        ContractBuyout,
        [Display(Name = "Договор частично выкуплен")]
        ContractPartialBuyout,
        [Display(Name = "Договор частично погашен")]
        ContractPartialPayment,
        [Display(Name = "Примечание к договору сохранено")]
        ContractNoteSaved,
        [Display(Name = "Примечание к договору удалено")]
        ContractNoteDeleted,
        [Display(Name = "Договор передан")]
        ContractTransferred,
        [Display(Name = "Ежемесячное погашение договора")]
        ContractMonthlyPayment,
        [Display(Name = "Добор")]
        ContractAddition,
        // cashorders
        [Display(Name = "Кассовый ордер сохранен")]
        CashOrderSaved = 340,
        [Display(Name = "Кассовый ордер удален")]
        CashOrderDeleted,
        [Display(Name = "Кассовый ордер восстановлен")]
        CashOrderRecovery,
        [Display(Name = "Кассовый ордер одобрен")]
        CashOrderApproved,
        [Display(Name = "Кассовый ордер отклонен")]
        CashOrderProhibited,
        // sellings
        [Display(Name = "Позиция на реализации сохранена")]
        SellingSaved = 360,
        [Display(Name = "Позиция на реализации удалена")]
        SellingDeleted,
        [Display(Name = "Позиция на реализации восстановлена")]
        SellingRecovery,
        [Display(Name = "Позиция на реализации продана")]
        SellingSell,
        [Display(Name = "Продажа позиции на реализации отменена")]
        SellingSellCancel,
        [Display(Name = "Уведомление сохранено")]
        NotificationSaved = 400,
        [Display(Name = "Уведомление удалено")]
        NotificationDeleted,
        [Display(Name = "Уведомление установлено для отправки")]
        NotificationSetForSend,
        [Display(Name = "Формирование уведомлений об оплате отключено")]
        PaymentNotificationOff,
        [Display(Name = "Персональное уведомление сохранено")]
        InnerNotificationSaved = 420,
        [Display(Name = "Персональное уведомление удалено")]
        InnerNotificationDeleted,
        [Display(Name = "Персональное уведомление прочитано")]
        InnerNotificationReaden,
        [Display(Name = "Персональное уведомление выполнено")]
        InnerNotificationAccepted
    }
}