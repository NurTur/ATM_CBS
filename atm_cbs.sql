-- Дамп структуры базы данных atm-api
CREATE DATABASE IF NOT EXISTS `atm_cbs` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `atm_cbs`;

-- Дамп структуры для таблица atm-api.accounts
CREATE TABLE IF NOT EXISTS `almaty_communal` (
  `personalAccount` int(9) NOT NULL,
  `address` varchar(80) NOT NULL,
  `countPersons` int(3) NOT NULL,
  `payer` varchar(80) NOT NULL,
  PRIMARY KEY (`personalAccount`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `almaty_communal` ( `personalAccount`, `address`, `countPersons`, `payer`) VALUES
	(269081836, 'с.Балтабай', 3 , 'Куатбеков Нурлан');
