body {
  font-family: 'Segoe UI', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
  color: #222;
  transition: background-color 0.3s, color 0.3s;
}

body.dark-mode {
  background-color: #121212;
  color: #eee;
}

.container {
  max-width: 500px;
  margin: 50px auto;
  text-align: center;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  margin: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  background-color: #ffd54f;
  transform: scale(1.05);
}

.recorder-box {
  background-color: #e0f7fa;
  padding: 20px;
  margin-top: 20px;
  border-radius: 10px;
  transition: background-color 0.3s;
}

body.dark-mode .recorder-box {
  background-color: #1f1f1f;
}

.fade-in {
  animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
