let mediaRecorder;
let audioChunks = [];

document.getElementById('recordBtn').onclick = async () => {
  const status = document.getElementById('status');
  const output = document.getElementById('output');

  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) {
        audioChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = async () => {
      status.textContent = "Uploading...";
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      try {
        const response = await fetch('upload.php', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        output.textContent = result.text || '❌ Error: ' + result.error;
        status.textContent = "Done ✅";
      } catch (err) {
        output.textContent = '❌ Network or Server Error';
        status.textContent = "Failed";
      }

      document.getElementById('recordBtn').textContent = "🎙️ Tap to Record";
    };

    mediaRecorder.start();
    status.textContent = "Recording... ⏺";
    document.getElementById('recordBtn').textContent = "⏹ Stop Recording";
  } else {
    mediaRecorder.stop();
  }
};

// Dark mode toggle
document.getElementById('toggleMode').onclick = () => {
  document.body.classList.toggle('dark-mode');
};

// Music control
function toggleMusic(play) {
  const music = document.getElementById('bgMusic');
  if (play) {
    music.play();
  } else {
    music.pause();
    music.currentTime = 0;
  }
}
