<?php

	require_once 'tinysong.php';
	
	$api_key = '67b088cec7b78a5b29a42a7124928c87';
	
	$query = $_GET['query'];
	
	$tinysong = new Tinysong($api_key);
	
	$result = $tinysong
	            ->single_tinysong_metadata($query)
	            ->execute();
	
	echo $_GET['callback'] . "(" . json_encode($result) . ");";

?>