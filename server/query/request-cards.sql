SELECT user_iin, label,number,amount,ccode, bonus_amount, bonus_ccode
FROM 
	cards
WHERE
	userid = ?