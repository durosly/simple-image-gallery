<?php
	require_once 'config/conn.php';

	if(isset($_GET['start'])) {
		$sql = "SELECT * FROM images ORDER BY id DESC LIMIT ?,6;";
		$stmt = $conn->prepare($sql);

		if(!$stmt) {
			http_response_code(400);
			echo json_encode(array("message" => "Something went wrong."));
			exit();
		} else {
			$start = htmlspecialchars(strip_tags($_GET['start']));
			$stmt->bind_param("i", $start);

			if(!$stmt->execute()) {
				http_response_code(401);
				echo json_encode(array("message" => "Failed to execute statement."));
				exit();
			} else {
				$result = $stmt->get_result();
				$data = array();
				//date_default_timezone_set("west central africa");
				while($row = $result->fetch_assoc()) {
					extract($row);
					$date = date("d l, m, Y", strtotime($timeAdded));
					$time = date("h:i:sa", strtotime($timeAdded));
					$item = array(
						"id" => $id,
						"name" => $name,
						"credit" => $credit,
						"filename" => $fileName,
						"date" => $date,
						"time" => $time
					);

					array_push($data, $item);
				}

				http_response_code(200);
				echo json_encode($data);
			}
		}
	}