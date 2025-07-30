<?php
// AssemblyAI API key
$apiKey = 'YOUR_ASSEMBLY_AI_API_KEY';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['audio'])) {
        echo json_encode(['error' => 'No audio file uploaded']);
        exit;
    }

    // Step 1: Upload audio to AssemblyAI
    $audioFile = $_FILES['audio']['tmp_name'];
    $uploadUrl = 'https://api.assemblyai.com/v2/upload';

    $audioData = file_get_contents($audioFile);
    $ch = curl_init($uploadUrl);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "authorization: $apiKey",
        "transfer-encoding: chunked"
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $audioData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $uploadResponse = json_decode(curl_exec($ch), true);
    curl_close($ch);

    if (!isset($uploadResponse['upload_url'])) {
        echo json_encode(['error' => 'Upload failed']);
        exit;
    }

    $audioUrl = $uploadResponse['upload_url'];

    // Step 2: Transcribe
    $ch = curl_init('https://api.assemblyai.com/v2/transcript');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "authorization: $apiKey",
        "content-type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['audio_url' => $audioUrl]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $transcribeResponse = json_decode(curl_exec($ch), true);
    curl_close($ch);

    if (!isset($transcribeResponse['id'])) {
        echo json_encode(['error' => 'Transcription request failed']);
        exit;
    }

    $transcriptId = $transcribeResponse['id'];

    // Step 3: Poll for completion
    $pollUrl = "https://api.assemblyai.com/v2/transcript/$transcriptId";
    $status = '';
    while ($status !== 'completed' && $status !== 'error') {
        sleep(3);
        $ch = curl_init($pollUrl);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["authorization: $apiKey"]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $pollResponse = json_decode(curl_exec($ch), true);
        curl_close($ch);
        $status = $pollResponse['status'];
    }

    if ($status === 'completed') {
        echo json_encode(['text' => $pollResponse['text']]);
    } else {
        echo json_encode(['error' => 'Transcription failed']);
    }
}
?>
