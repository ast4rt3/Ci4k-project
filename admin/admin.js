const { ipcRenderer } = require('electron'); // Electron IPC for window controls

// Function to fetch lab logs from the server
function fetchLabLogs() {
  fetch(' 192.168.1.9:8080/lab_logs') // Updated API endpoint
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((logs) => {
      updateTable(logs); // Pass data to table update function
    })
    .catch((error) => console.error('Error fetching lab logs:', error));
}

// Function to update the table with fetched data
function updateTable(logs) {
  const tableBody = document.getElementById('client-table-body');
  if (!tableBody) {
    console.error('Table body element not found!');
    return;
  }

  tableBody.innerHTML = ''; // Clear existing rows before inserting new ones

  logs.forEach((log) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${log.id || '-'}</td>
      <td>${log.studentID || '-'}</td>
      <td>${log.computer_number || '-'}</td>
      <td>${formatTime(log.login_time)}</td>
      <td>${formatTime(log.logout_time)}</td>
      <td>${formatDuration(log.duration)}</td>
    `;
    tableBody.appendChild(row); // Append the row to the table body
  });
}

// Helper function to format time
function formatTime(time) {
  if (!time || isNaN(new Date(time).getTime())) return '-'; // Handle invalid or missing time
  const date = new Date(time);
  return date.toLocaleString(); // Convert to a readable format
}

// Helper function to format duration into HH:MM:SS
function formatDuration(durationInSeconds) {
  if (!durationInSeconds || isNaN(durationInSeconds)) return '-'; // Handle missing or invalid durations
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
}

// Helper function to pad single digits with leading zeros
function padNumber(number) {
  return number < 10 ? `0${number}` : number;
}

// Minimize the window
function minimizeWindow() {
  ipcRenderer.send('minimize-window');
}

// Close the window
function closeWindow() {
  ipcRenderer.send('close-window'); // Send the close event to the main process
}

// Fetch lab logs periodically (every 5 seconds)
setInterval(fetchLabLogs, 5000); // Automatic updates
fetchLabLogs(); // Initial call to fetch data
