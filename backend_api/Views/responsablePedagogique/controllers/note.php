<?php
if(isset($_POST["envoi"]))
{
    if(!empty($_POST["mat_et"]) || !empty($_POST["cmat"]) ||!empty($_POST["cc"]) ||!empty($_POST["tp"]) ||!empty($_POST["sy"]) ||!empty($_POST["s"]))
    {
        include "connbd.php";
        $matEt=$_POST["mat_et"];
        $codemat=$_POST["cmat"];
        $cc=$_POST["cc"];
        $tp=$_POST["tp"];
        $syn=$_POST["sy"];
        $semestre=$_POST["s"];
        $select="SELECT id FROM etudiants WHERE matricule = '$matEt'";
        $cm="SELECT id From matieres WHERE code_matiere = '$codemat'";
        $verif=mysqli_query($bd,$select);
        $r=mysqli_query($bd,$cm);
        if($row=$verif->fetch_assoc()){
             $idEt=$row['id'];
        }
        else{
            echo "Aucun etudiant ne possède ce matricule";
        }
        if($row=$r->fetch_assoc()){
             $idmat=$row['id'];
        }
        else{
            echo "Aucune matiere ne possède ce code";
        }
        $insert="INSERT INTO notes(id_etudiant,id_matiere,note_cc,note_tp,note_synthese,semestre) VALUES ('$idEt','$idmat','$cc','$tp','$syn','$semestre')";
        $result= mysqli_query($bd,$insert);
        if(!$result)
        {
            echo "Echec d'enregistrenents";
        }
        else{
            echo "Enregistrement réussi!!!";
        }
    }
    else{
        echo "Veuillez entrer les champs";
    }
   
} 
?>