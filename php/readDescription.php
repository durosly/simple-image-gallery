<?php

	require_once 'config/conn.php';

	if(isset($_GET['id'])) {
		//sql
		$sql = "SELECT name, description FROM images WHERE id=? LIMIT 1;";
		//prepared statement
		$stmt = $conn->prepare($sql);

		//check whether statement didn't worked with database
		if(!$stmt) {
			http_response_code(400);
			echo json_encode(array("message" => "SQL Failed!!!"));
			exit();
		} else {
			//sanitize data
			$id = (int)htmlspecialchars(strip_tags(trim($_GET['id'])));

			//bind parameter to statement
			$stmt->bind_param('i', $id);
			//query database for image name and description
			if(!$stmt->execute()) {
				http_response_code(401);
				echo json_encode(array("message" => "Failed to execute statement"));
				exit();
			} else {
				//get result from statement
				$result = $stmt->get_result();

				//check if data was found
				if(!($result->num_rows > 0)){
					http_response_code(404);
					echo json_encode(array("message" => "No item found."));
				} else {
					$row = $result->fetch_assoc();
					http_response_code(200);
					$data = array(
						"name" => $row['name'],
						"description" => $row['description']
					);
					echo json_encode($data);
				}
			}
		}
		
	}