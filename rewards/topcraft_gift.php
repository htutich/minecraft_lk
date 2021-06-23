
<?php
	// Скрипт поощрений за голосования в рейтинге TopCraft.RU
	// Данные, которые необходимо отредактировать под ваш проект:

	$nagrada = '5'; 				// Награда за 1 голос
	$conf['host'] = 'localhost'; 				// IP сервера (чаще всего это localhost)
	$conf['user'] = 'solmics'; 					// Пользователь базы данных
	$conf['pass'] = 'nHP3xwc6scTA'; 				// Пароль к базе данных
	$conf['name'] = 'solmics'; 					// Название базы данных
	$conf['table'] = 'mcr_iconomy'; 			// Таблица, в которую будут начисляться деньги
	$money = 'realmoney';							// Столбец, в который выдается награда
	$nikname = 'username';						// Столбец, в котором записываются ники игроков
	$conf['secretkey'] = 'c8fc110ee6cfaaf12b3065bdcaeab83e'; // Секретный ключ на TopCraft.Ru (Настраивается в Мои проекты --> Скрипт поощрений)

	// Код ниже не рекомендуется редактировать, если вы не обладаете знаниями в PHP и MySQL.

	$table = $conf['table'];
	$timestamp = $_POST['timestamp']; 					// Передает время, когда человек проголосовал за проект
	$username = htmlspecialchars($_POST['username']); 	// Передает ник проголосовавшего
	$connect = mysqli_connect($conf['host'], $conf['user'], $conf['pass'], $conf['name']) or die('error connect');
	mysqli_select_db($connect, $conf['name']) or die(mysqli_error());
	if (!preg_match("/^[a-zA-Z0-9_-]+$/", $username)) die("Bad login");
	if ($_POST['signature'] != sha1($username.$timestamp.$conf['secretkey'])) die("hash mismatch");
	$sql_username = strtolower($username);
	mysqli_query($connect, "UPDATE {$table} SET $money = $money+$nagrada WHERE $nikname='{$sql_username}'") or die(mysqli_error($connect));
	mysqli_query($connect, "INSERT INTO `rate_top` (`username`, `amount`, `date`) VALUES ('{$sql_username}', '1', now())") or die(mysqli_error($connect));
	//echo 'OK';
	echo $sql_username;
	mysqli_close($connect);

	// TopCraft.RU (с) 2011-2016. Last update: 19.09.2016
?>
