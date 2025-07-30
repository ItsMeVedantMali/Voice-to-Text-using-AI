let mediaRecorder;
let audioChunks = [];

document.getElementById('recordBtn').onclick = async () => {
  const status = document.getElementById('status');
  const resultDiv = document.getElementById('result');
  
  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = e => {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      status.textContent = "Status: Uploading...";
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('upload.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      resultDiv.textContent = result.text || 'Error: ' + result.error;
      status.textContent = "Status: Done";
      audioChunks = [];
    };

    mediaRecorder.start();
    status.textContent = "Status: Recording...";
    document.getElementById('recordBtn').textContent = "Stop Recording";
  } else {
    mediaRecorder.stop();
    document.getElementById('recordBtn').textContent = "Start Recording";
  }
};
