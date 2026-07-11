<?php
/**
 * Fichier de test pour vérifier la configuration
 * Accédez à: http://localhost/Integration/test.php
 */

echo "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Test</title>";
echo "<style>body{font-family:Arial;max-width:800px;margin:50px auto;background:#f0f2f5;padding:20px;}";
echo ".test{padding:15px;margin:10px 0;border-radius:5px;border-left:4px solid;}</style></head><body>";
echo "<h1>🧪 Test de Configuration</h1>";

// Test 1: Vérifier si PHP fonctionne
echo "<div class='test' style='border-left-color:#27ae60;background:#d5f4e6;'>";
echo "✅ PHP fonctionne correctement";
echo "</div>";

// Test 2: Vérifier la version PHP
echo "<div class='test' style='border-left-color:#3498db;background:#ebf5fb;'>";
echo "ℹ️ Version PHP: " . phpversion();
echo "</div>";

// Test 3: Tester la connexion à la BD
require_once 'config.php';

echo "<div class='test' style='border-left-color:" . ($conn ? "#27ae60" : "#e74c3c") . ";background:" . ($conn ? "#d5f4e6" : "#fadbd8") . ";'>";
if ($conn->connect_error) {
    echo "❌ Erreur de connexion: " . $conn->connect_error;
} else {
    echo "✅ Connexion à la base de données réussie";
    
    // Afficher les tables
    $result = $conn->query("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA='mon-iut'");
    if ($result) {
        echo "<br><strong>Tables trouvées:</strong><ul>";
        while ($row = $result->fetch_assoc()) {
            echo "<li>" . $row['TABLE_NAME'] . "</li>";
        }
        echo "</ul>";
    }
}
echo "</div>";

// Test 4: Vérifier le dossier uploads
echo "<div class='test' style='border-left-color:" . (is_dir('uploads') ? "#27ae60" : "#e74c3c") . ";background:" . (is_dir('uploads') ? "#d5f4e6" : "#fadbd8") . ";'>";
if (is_dir('uploads')) {
    echo "✅ Dossier 'uploads' existe";
    echo "<br>Permissions: " . substr(sprintf('%o', fileperms('uploads')), -4);
} else {
    echo "❌ Dossier 'uploads' n'existe pas";
    echo "<br><strong>Créez-le avec:</strong> <code>mkdir uploads && chmod 755 uploads</code>";
}
echo "</div>";

// Test 5: Vérifier les fichiers API
$api_files = ['api/notes.php', 'api/communiques.php', 'api/documents.php', 'api/data.php'];
foreach ($api_files as $file) {
    $exists = file_exists($file);
    echo "<div class='test' style='border-left-color:" . ($exists ? "#27ae60" : "#e74c3c") . ";background:" . ($exists ? "#d5f4e6" : "#fadbd8") . ";'>";
    echo ($exists ? "✅" : "❌") . " " . $file;
    echo "</div>";
}

// Test 6: Vérifier les fichiers HTML frontend
$html_files = ['note.html', 'Communiques.html', 'td.html'];
echo "<h2>Frontend</h2>";
foreach ($html_files as $file) {
    $exists = file_exists($file);
    echo "<div class='test' style='border-left-color:" . ($exists ? "#27ae60" : "#e74c3c") . ";background:" . ($exists ? "#d5f4e6" : "#fadbd8") . ";'>";
    echo ($exists ? "✅" : "❌") . " " . $file . " <a href='" . $file . "' style='float:right;'>Voir →</a>";
    echo "</div>";
}

echo "</body></html>";
?>
