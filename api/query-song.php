<?php

	require_once 'tinysong.php';
	
	$api_key = '121900a05afcb2d386f0959aac76304b';
	
	$query = $_GET['query'];
	
	$tinysong = new Tinysong($api_key);
	
	$result = $tinysong
	            ->single_tinysong_metadata($query)
	            ->execute();
	
	if (empty($result))
		echo 'null';
	else
		echo json_encode($result);

?>