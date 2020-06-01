<?php

	$errors = array();

	if(!isset($_POST['filename']) || empty($_POST['filename'])) {
		$errors['filename'] = 'empty field';
	}

	if(!isset($_POST['filecredit']) || empty($_POST['filecredit'])) {
		$errors['filecredit'] = 'empty field';
	}

	if(!isset($_FILES['file']) || empty($_FILES['file'])) {
		$errors['file'] = 'No file selected';
	}

	if(!empty($errors)) {
		http_response_code(403);
		echo json_encode($errors);
		die();
	} else {
		//validate filename characters [short note]


		if(strlen($_POST['filename']) > 21) {
			$errors['filename'] = 'Too long. Max 21 characters.';
		} else if(strlen($_POST['filename']) < 3) {
			$errors['filename'] = 'Too short. Min 3 characters.';
		}

		if(strlen($_POST['filecredit']) > 21) {
			$errors['filecredit'] = 'Too long. Max 21 characters.';
		} else if(strlen($_POST['filecredit']) < 3) {
			$errors['filecredit'] = 'Too short. Min 3 characters.';
		}

		if($_FILES['file']['size'] > (10 * 1024 * 1024)) {
			//Not larger than 10MB of image
			$errors['file'] = 'File too large.';
		} else if($_FILES['file']['size'] < (500 * 1024)) {
			$errors['file'] = "File too small.";
		}

		if(!empty($errors)) {
			http_response_code(403);
			echo json_encode($errors);
			die();
		} else {
			require_once 'config/conn.php';

			$name = htmlspecialchars(strip_tags(trim($_POST['filename'])));
			$credit = htmlspecialchars(strip_tags(trim($_POST['filecredit'])));
			$description = htmlspecialchars(strip_tags(trim($_POST['filedesc'])));

			$file = $_FILES['file'];
			$fileFullName = $file['name'];
			$fileTmp = $file['tmp_name'];
			$filesize = $file['size'];
			$fileError = $file['error'];

			$allowedTypes = array("jpg", "jpeg", "gif", "png");

			if($fileError) {

				http_response_code(400);
				echo json_encode(array("message" => "There was an error uploading this file."));
				die();
			} else {
				$sql = "INSERT INTO images (name, credit, fileName, description) VALUES (?,?,?,?);";
				$stmt = $conn->prepare($sql);

				if(!$stmt) {
					http_response_code(400);
					echo json_encode(array("message" => "SQL failed"));
					die();
				} else {
					$fileFullNameArr = explode(".", $fileFullName);
					$fileExt = strtolower(end($fileFullNameArr));
					$newName = substr((uniqid("durosly-gallery__".$fileFullNameArr[0], true)), 0, 250) . '.' . $fileExt;
					$fullPath = "../images/". $newName;

					if(!in_array($fileExt, $allowedTypes)) {
						http_response_code(403);
						echo json_encode(array("message" => "File type of {$fileExt} is not allowed."));
						exit(); 
					} else {
						$stmt->bind_param("ssss", $name, $credit, $newName, $description);
						if(!move_uploaded_file($fileTmp, $fullPath)) {
							http_response_code(400);
							echo json_encode(array("message" => "File upload was not successful."));
						} else {

							if(!$stmt->execute()) {
								http_response_code(400);
								echo json_encode(array("message" => "Failed to connect to the database."));
								exit();
							} else {
								http_response_code(200);
								echo json_encode(array("message" => "Upload successful."));
								exit();
							}
						}
					}
					

				}

			}
		}
	}