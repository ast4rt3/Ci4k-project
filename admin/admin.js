const socket = new WebSocket('ws://localhost:8080');
const peerConnection = new RTCPeerConnection();

socket.onopen = () => {
  console.log("Connected to signaling server.");
};

peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
  }
};

peerConnection.ontrack = (event) => {
  const remoteStream = event.streams[0];
  // Handle incoming stream (e.g., display in a video element)
};

socket.onmessage = async (event) => {
  const message = JSON.parse(event.data);

  if (message.type === 'offer') {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.send(JSON.stringify({ type: 'answer', answer }));
  }

  if (message.type === 'answer') {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
  }

  if (message.type === 'candidate') {
    await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
  }
};
