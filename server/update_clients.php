<?php
// update_clients.php
$servername = "localhost";  // Your database server
$username = "root";         // Your database username
$password = "";             // Your database password
$dbname = "ci4k_project";   // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the data from the WebSocket server
$data = json_decode(file_get_contents("php://input"));

// Handle different types of updates
if ($data->type == 'newUser') {
    // Insert new user connection details into the database
    $stmt = $conn->prepare("INSERT INTO clients (client_id, status, connect_time) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $data->clientId, $data->status, $data->connectTime);
    $stmt->execute();
    $stmt->close();
} elseif ($data->type == 'userDisconnected') {
    // Update the status and disconnect time for the user
    $stmt = $conn->prepare("UPDATE clients SET status = ?, disconnect_time = ?, duration = ? WHERE client_id = ?");
    $stmt->bind_param("ssis", $data->status, $data->disconnectTime, $data->duration, $data->clientId);
    $stmt->execute();
    $stmt->close();
} elseif ($data->type == 'updateClients') {
    // Fetch all clients' data and return it to the WebSocket server
    $result = $conn->query("SELECT * FROM clients");

    $clients = [];
    while ($row = $result->fetch_assoc()) {
        $clients[] = $row;
    }

    echo json_encode($clients);
}

$conn->close();
?>
