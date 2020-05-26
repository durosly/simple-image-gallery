<?php
	require_once 'config/conn.php';

	if(isset($_GET['start'])) {
		$sql = "SELECT * FROM images LIMIT ?,6;";
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

				while($row = $result->fetch_assoc()) {
					extract($row);
					$item = array(
						id => $id,
						name => $name,
						credit => $credit,
						filename => $fileName,
						description => $description,
						timestamp => $timeAdded
					);

					array_push($data, $item);
				}

				http_response_code(200);
				echo json_encode($data);
			}
		}
	}