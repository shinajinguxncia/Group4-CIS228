// Save Journal Entry
function saveTextEntry() {
  const title = document.getElementById("entryTitle").value;
  const text = document.getElementById("entryText").value;
  const entriesList = document.getElementById("entriesList");

  // Check if fields are empty
  if (title.trim() === "" || text.trim() === "") {
    alert("Please enter a title and your thoughts.");
    return;
  }

  // Create new entry container
  const entryDiv = document.createElement("div");
  entryDiv.classList.add("entry");

  // Add content
  entryDiv.innerHTML = `
    <h3>${title}</h3>
    <p>${text}</p>
    <button onclick="deleteEntry(this)">Delete</button>
  `;

  // Remove default message
  if (entriesList.innerHTML.includes("No entries yet")) {
    entriesList.innerHTML = "";
  }

  // Add new entry
  entriesList.appendChild(entryDiv);

  // Clear inputs
  document.getElementById("entryTitle").value = "";
  document.getElementById("entryText").value = "";
}

// Delete Entry
function deleteEntry(button) {
  button.parentElement.remove();

  const entriesList = document.getElementById("entriesList");

  // Show default message if no entries left
  if (entriesList.children.length === 0) {
    entriesList.innerHTML = "<p>No entries yet.</p>";
  }
}

// Voice Recording Variables
let mediaRecorder;
let audioChunks = [];

// Start Voice Recording
async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    mediaRecorder = new MediaRecorder(stream);

    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstart = () => {
      document.getElementById("recordingStatus").innerText =
        "Recording status: Recording...";
    };

    mediaRecorder.onstop = () => {
      document.getElementById("recordingStatus").innerText =
        "Recording status: Recording saved.";

      const audioBlob = new Blob(audioChunks, {
        type: "audio/mp3",
      });

      const audioURL = URL.createObjectURL(audioBlob);

      const audioElement = document.createElement("audio");
      audioElement.controls = true;
      audioElement.src = audioURL;

      document.getElementById("entriesList").appendChild(audioElement);
    };

    mediaRecorder.start();
  } catch (error) {
    alert("Microphone access denied or unavailable.");
  }
}

// Stop Voice Recording
function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
}

// Mask Off Mode
function clearMaskOff() {
  const maskOffText = document.getElementById("maskOffText");

  if (maskOffText.value.trim() === "") {
    alert("Write something first.");
    return;
  }

  alert("Your thoughts were released safely.");

  maskOffText.value = "";
}