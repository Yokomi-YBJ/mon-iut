<?php
$bd=mysqli_connect("localhost","root","","mon-iut");
if(!$bd)
{
    die("Echec de connexion:".mysqli_connect_error());
}
?>