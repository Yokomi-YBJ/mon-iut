<?php
if(isset($_POST["envoi"]))
{
    if(!empty($_POST["con"]))
    {
        include "connbd.php";
        $titre="Emploi de temps";
        $type="EDT";
        $des=$_POST["des"];
        $con=$_POST["con"];
        $insert="INSERT INTO documents(titre,url_fichier,type_doc) VALUES ('$titre','$con','$type')";
        $result= mysqli_query($bd,$insert);
        if(!$result)
        {
            echo "Echec d'enregistrenents";
        }
        else{
            header("location:../doc.php");
        }
    }
        
} 
?>