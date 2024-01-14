document.addEventListener("DOMContentLoaded", function () {
  let transcriptionArea = document.getElementById("transcription");
  let startRecordingButton = document.getElementById("startRecording");
  let stopRecordingButton = document.getElementById("stopRecording");
  let recognition = new webkitSpeechRecognition();
  let isRecording = false;
  let recognitionState = null;
  let finalTranscript = "";

  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = function (event) {
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript + " ";
      } else {
        interimTranscript += event.results[i][0].transcript + " ";
      }
    }

    let displayText =
      "<b>Interim:</b> " +
      interimTranscript +
      "<br><b>Final:</b> " +
      finalTranscript;
    transcriptionArea.innerHTML = displayText;

    if (finalTranscript.length > 100000) {
      finalTranscript = finalTranscript.slice(-100000);
    }
  };

  recognition.onend = function () {
    if (isRecording) {
      recognition.start();
    }
  };

  startRecordingButton.addEventListener("click", function () {
    if (!isRecording) {
      if (recognitionState) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = recognitionState.onresult;
        recognition.onend = recognitionState.onend;
      }

      recognition.start();
      isRecording = true;
      startRecordingButton.innerHTML = "Recording...";
      startRecordingButton.style.backgroundColor = "red";
    }
  });

  stopRecordingButton.addEventListener("click", function () {
    if (isRecording) {
      recognition.stop();
      isRecording = false;
      startRecordingButton.innerHTML = "Start Recording";
      startRecordingButton.style.backgroundColor = "";
      recognitionState = {
        onresult: recognition.onresult,
        onend: recognition.onend,
      };
    }
  });
});
