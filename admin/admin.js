const { ipcRenderer } = require('electron');
const WebSocket = require('ws');

// WebSocket setup
const ws = new WebSocket('ws://192.168.1.5:8080'); // WebSocket server connection

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

    // Check if the message is related to lab logs update
    if (data.type === 'labLogsUpdate') {
      updateLabLogsTable(data.data);  // Update the table with new lab logs data
    }

    // Handle other WebSocket message types (e.g., client connect/disconnect)
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

// Function to update the lab logs table on the admin dashboard
function updateLabLogsTable(logs) {
  const tableBody = document.getElementById('client-table-body');
  if (!tableBody) {
    console.error('Table body element not found!');
    return;
  }

  // Clear existing table rows
  tableBody.innerHTML = '';

  // Loop through each log and add a row to the table
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

// Format duration (if available) to a readable format (HH:MM:SS)
function formatDuration(durationInSeconds) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;

  return `${hours}:${minutes}:${seconds}`;
}

document.getElementById('export-csv').addEventListener('click', () => {
  fetch('http://localhost:3000/lab-logs')
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


// Call fetchLabLogs when the page is loaded
fetchLabLogs();

// Export to CSV functionality
function convertToCSV(logs) {
  const headers = ['Client ID', 'PC', 'Connect Time', 'Disconnect Time', 'Duration'];
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

function downloadCSV(data) {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'lab_logs.csv');
  link.click();
}

