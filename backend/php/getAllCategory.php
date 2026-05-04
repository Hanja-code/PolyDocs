<?php 
require '../fonction/fonction.php';

$category = getAllCategory();
echo json_encode($category)
?>