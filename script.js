

const recordButton = document.getElementById("record");
const stopButton = document.getElementById("stopRecord");
const pauseButton = document.getElementById("pause");

let currentDateTime = "";

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
        .getUserMedia(
            {
                audio:
                { 
                    channels: 2, 
                    autoGainControl: false, 
                    echoCancellation: false, 
                    noiseSuppression: false 
                }
            }
        )
        .then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            recordButton.onclick = () => {
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                console.log("recorder started");
                recordButton.style.background = "red";
                recordButton.style.color = "black";

                currentDateTime = getDateTimeString();
                
              };

            let chunks = [];

            mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
            };

            pauseButton.onclick = () => {
                if (mediaRecorder.state === "recording") {
                    mediaRecorder.pause();
                    pauseButton.style.backgroundColor = "yellow";
                    
                } else if (mediaRecorder.state === "paused") {
                    mediaRecorder.resume();
                    pauseButton.style.backgroundColor = "white";
                }
            };
            

            stopButton.onclick = () => {
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
                console.log("recorder stopped");
                record.style.background = "";
                record.style.color = "";
              };

              mediaRecorder.onstop = (e) => {
                console.log("recorder stopped");
              
                let clipName = prompt("Enter a name for your sound clip, leave blank to use time of recording.");
                if (clipName == "") {
                    clipName = currentDateTime;
                }

                const audioLabel = document.createElement("p");
                const audio = document.createElement("audio");

                const link = document.createElement("a");

                audio.controls = "controls";
                audio.type = "audio/mp3"
                audio.controlsList = "nodownload";
                audioLabel.innerText = clipName;

                const container = document.getElementById("container");
                container.appendChild(audioLabel);
                container.appendChild(audio);

                

                const blob = new Blob(chunks, {type: "audio/mp3; codecs=mp3"});
                chunks = [];
                const audioURL = window.URL.createObjectURL(blob);

                link.download = clipName;
                link.href = audioURL;
                link.innerText = `Download: ${clipName}`;
                container.appendChild(link);

                audio.src = audioURL;

              }
              

              
        })
        .catch((err) => {
            console.log(`The follwing error occurred: ${err}`);
        });
} else {
    console.log("Get user media not supported.");
}


function getDateTimeString() {
    const dt = new Date();
    const dateTimeStr = `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}-${dt.getHours()}-${dt.getMinutes()}-${dt.getSeconds()}`;
    return dateTimeStr;
}


// Wake Lock Code
const screenWake = document.getElementById("screenWake");

let isSupported = false;
let wakeLock = null;
const wakeLabel = document.getElementById("wakeLabel");

screenWake.addEventListener("click", async () =>{
    if (screenWake.checked) {
        if ("wakeLock" in navigator) {
            isSupported = true;
            try {
                wakeLock = await navigator.wakeLock.request("screen");
                wakeLabel.innerText = "Wake Lock is active!";
              } catch (err) {
                console.log(`${err.name}, ${err.message}`);
                wakeLabel.innerText = "Wake Lock error, check battery settings."
              }

        } else {
            isSupported = false;
            document.getElementById("wakeLabel").innerText = "Wake Lock Not Supported";
        }
    } else {
        wakeLock.release().then(() => {
            wakeLock = null;
            wakeLabel.innerText = "Keep Screen Awake";
          });
    }
})
