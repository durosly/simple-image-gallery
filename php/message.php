<?php


	$errors = array();

	if(!isset($_POST['email']) || empty($_POST['email'])) {
		$errors['email'] = 'empty field';
	} else if(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
		$errors['email'] = "Invalid email";
	}

	if(!isset($_POST['message']) || empty($_POST['message'])) {
		$errors['message'] = 'empty field';
	}

	if(!empty($errors)) {
		http_response_code(403);
		echo json_encode($errors);
	} else {
		require_once 'config/conn.php';
		$sql = "INSERT INTO messages (email, message) VALUES (?,?);";
		$msg = htmlspecialchars(strip_tags($_POST['message']));
		$email = htmlspecialchars(strip_tags($_POST['email']));

		$stmt = $conn->prepare($sql);

		if(!$stmt) {
			http_response_code(401);
			echo json_encode(array("message" => "SQL failed."));
		} else {
			$stmt->bind_param("ss", $email, $msg);

			if(!$stmt->execute()){
				http_response_code(401);
				echo json_encode(array("message" => "SQL failed."));
			} else {
				http_response_code(200);
				echo json_encode(array("message" => "Message sent"));
			}
		}
	}