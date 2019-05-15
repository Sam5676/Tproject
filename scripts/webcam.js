'use strict';

/* globals MediaRecorder */

const mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
let mediaRecorder;
let recordedBlobs;
let sourceBuffer;

const errorMsgElement = document.querySelector('span#errorMsg');
const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button.record-button');
recordButton.addEventListener('click', () => {
    if (recordButton.textContent === 'Start Recording') {
        startRecording();
    }else if (recordButton.textContent === 'Rewrite Recording'){
        startRecording();
    }else if (recordButton.textContent === 'Следующий вопрос') {
        startRecording();
    }
    else {
        stopRecording();
        recordButton.textContent = 'Rewrite Recording';
        // playButton.disabled = false;
    }
});

// const playButton = document.querySelector('button#play');
// playButton.addEventListener('click', () => {
//     document.querySelector('.video-play').style.display="block";
//     const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
//     recordedVideo.src = null;
//     recordedVideo.srcObject = null;
//     recordedVideo.src = window.URL.createObjectURL(superBuffer);
//     recordedVideo.controls = true;
//     recordedVideo.play();
//     let oldElem = document.querySelector('.video-record');
//     document.querySelector('.main-screen').removeChild(oldElem);
// });

function handleSourceOpen(event) {
    console.log('MediaSource opened');
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    console.log('Source buffer: ', sourceBuffer);
}

function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function startRecording() {
    document.querySelector('.video-play').style.display="none";
    document.querySelector('.video-record').style.display="block";
    recordedVideo.pause();
    recordedBlobs = [];
    let options = {mimeType: 'video/webm;codecs=vp9'};
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not Supported`);
        errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
        options = {mimeType: 'video/webm;codecs=vp8'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.error(`${options.mimeType} is not Supported`);
            errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
            options = {mimeType: 'video/webm'};
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.error(`${options.mimeType} is not Supported`);
                errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
                options = {mimeType: ''};
            }
        }
    }

    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
        return;
    }

    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    recordButton.textContent = 'Stop Recording';
    // playButton.disabled = true;
    mediaRecorder.onstop = (event) => {
        console.log('Recorder stopped: ', event);
    };
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10); // collect 10ms of data
    console.log('MediaRecorder started', mediaRecorder);

    var oneHalfMinutes = 90,
        display = document.querySelector('.reply-time');
    startTimer(oneHalfMinutes, display);
}

function startTimer(duration, display) {
    var start = Date.now(),
        diff,
        minutes,
        seconds,
        stop = (duration+1)*1000;
    function timer() {
        diff = duration - (((Date.now() - start) / 1000) | 0);

        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        if (diff <= 0) {

            start = Date.now() + 1000;
        }

        // if(diff===0){
        //     var oldElem = document.querySelector('.main__instruction-timer');
        //     var newElem = document.querySelector('.call-me').content;
        //
        //     document.querySelector('.tooltip-instructions').replaceChild(
        //         newElem.cloneNode(true), oldElem);
        // }
    };


    timer();
    // clearInterval(timer);
    setTimeout(function() {
        clearInterval(timeID);
    }, stop);
    var timeID = setInterval(timer, 1000);
}

function stopRecording() {
    mediaRecorder.stop();
    console.log('Recorded Blobs: ', recordedBlobs);
    const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    recordedVideo.controls = true;
    document.querySelector('.video-play').style.display="block";
    document.querySelector('.video-record').style.display="none";
}

function handleSuccess(stream) {
    recordButton.disabled = false;
    console.log('getUserMedia() got stream:', stream);
    window.stream = stream;

    const gumVideo = document.querySelector('video#gum');
    gumVideo.srcObject = stream;
}

async function init(constraints) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (e) {
        console.error('navigator.getUserMedia error:', e);
        errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
}

document.querySelector('button#start').addEventListener('click', async () => {
    const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
    const constraints = {
        audio: {
            echoCancellation: {exact: hasEchoCancellation}
        },
        video: {
            width: 400, height: 200
        }
    };
    console.log('Using media constraints:', constraints);
    await init(constraints);
});