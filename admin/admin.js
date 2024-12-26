const { ipcRenderer } = require('electron');
const WebSocket = require('ws');

// WebSocket setup
const ws = new WebSocket('ws://localhost:8080'); // WebSocket server connection

ws.onopen = () => {
  console.log('Connected to WebSocket server');
};

ws.onerror = (error) => {
  console.error('WebSocket Error:', error);
};

ws.onmessage = (message) => {
  try {
    console.log('Raw WebSocket message:', message.data); // Log raw WebSocket message

    const data = JSON.parse(message.data);
    console.log('Received:', data);

    // Handle lab logs update message
    if (data.type === 'labLogsUpdate') {
      updateLabLogsTable(data.data);  // Update the table with new lab logs data
    }

    // Handle other WebSocket message types (e.g., client connect/disconnect)
    // You can extend here with additional types like 'clientConnect', 'clientDisconnect', etc.
    // ...

  } catch (e) {
    console.error('Error parsing WebSocket message:', e);
  }
};

// Purge button logic
document.getElementById('purge-button').addEventListener('click', () => {
  if (confirm('Are you sure you want to purge all data from lab_logs? This action cannot be undone.')) {
    fetch('http://localhost:3000/purge-lab-logs', { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          alert('Lab logs purged successfully!');
        } else {
          response.json().then(data => {
            alert(`Failed to purge lab logs: ${data.message}`);
          });
        }
      })
      .catch((error) => {
        console.error('Error during purge:', error);
        alert('An error occurred while purging data.');
      });
  }
});

// Update the lab logs table with new data
function updateLabLogsTable(logs) {
  const tableBody = document.getElementById('client-table-body');
  if (!tableBody) {
    console.error('Table body element not found!');
    return;
  }

  // Clear existing rows
  tableBody.innerHTML = '';

  // Insert new rows into the table
  logs.forEach((log) => {
    const row = document.createElement('tr');
    row.id = `log-${log.id}`;

    // Format login and logout times
    const loginTime = new Date(log.login_time).toLocaleString();
    const logoutTime = log.logout_time ? new Date(log.logout_time).toLocaleString() : '-';
    const duration = log.duration ? formatDuration(log.duration) : '-';

    row.innerHTML = `
      <td>${log.studentID}</td>
      <td>${log.computer_number}</td>
      <td>${loginTime}</td>
      <td>${logoutTime}</td>
      <td>${duration}</td>
    `;

    tableBody.appendChild(row);
  });
}

// Poll the server every 5 seconds to check for updates
setInterval(fetchLabLogs, 5000);  // Update every 5 seconds

// Initially fetch the lab logs
fetchLabLogs();

// Fetch lab logs from server on page load
function fetchLabLogs() {
  fetch('http://localhost:3000/lab_logs')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch lab logs: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      updateLabLogsTable(data); // Update the table with fetched data
    })
    .catch(error => {
      console.error('Error fetching lab logs:', error);
      alert('Failed to load lab logs.');
    });
}

// Export to CSV functionality
document.getElementById('export-csv').addEventListener('click', () => {
  fetch('http://localhost:3000/lab_logs')
    .then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        // Throw an error with the status code for better error debugging
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse the JSON if the response is OK
    })
    .then(data => {
      downloadCSV(data); // Proceed with the CSV download if successful
    })
    .catch(error => {
      console.error('Error exporting data:', error);
      alert(`An error occurred while exporting data: ${error.message}`);
    });
});

// Convert logs to CSV format
function convertToCSV(logs) {
  const headers = ['Student ID', 'Computer #', 'Login Time', 'Logout Time', 'Duration'];
  const rows = logs.map(log => [
    log.studentID,
    log.computer_number,
    new Date(log.login_time).toLocaleString(),
    log.logout_time ? new Date(log.logout_time).toLocaleString() : '-',
    log.duration ? formatDuration(log.duration) : '-'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}

// Download the CSV file
function downloadCSV(data) {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'lab_logs.csv');
  link.click();
}

// Format the duration in a readable way
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}
