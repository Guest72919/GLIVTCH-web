const videoUpload = document.getElementById('video-upload');
const glitchVideo = document.getElementById('glitch-video');
const downloadButton = document.getElementById('download-button');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let mediaRecorder = null;
let recordedChunks = [];

document.addEventListener('DOMContentLoaded', () => {
    // File upload handler
    videoUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            glitchVideo.src = url;
            glitchVideo.load();
            glitchVideo.play();
        }
    });

    glitchVideo.addEventListener('play', () => {
        applyGlitchEffect();
    });

    // Handle download button click (data URL download)
    downloadButton.addEventListener('click', () => {
        convertVideoToWebM();
    });
});

// Function to apply the glitch effect on the video
function applyGlitchEffect() {
    const video = glitchVideo;
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    let frameCount = 0;

    // Start recording the video with the glitch effect applied
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(canvas.captureStream(30), { mimeType: 'video/webm' });
    mediaRecorder.ondataavailable = event => recordedChunks.push(event.data);
    mediaRecorder.onstop = () => {
        const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
        glitchVideo.src = URL.createObjectURL(videoBlob);
        downloadButton.style.display = 'block'; // Show download button
    };

    mediaRecorder.start();

    const glitchInterval = setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Create glitch by manipulating the pixel data
        for (let i = 0; i < data.length; i += 4) {
            // Apply random glitch effect on every 5th frame
            if (frameCount % 5 === 0) {
                const randomIntensity = Math.floor(Math.random() * (190 - 99 + 1)) + 99; // Random value between 99 and 190
                data[i] = Math.min(data[i] + randomIntensity, 255); // Red
                data[i + 1] = Math.min(data[i + 1] + randomIntensity, 255); // Green
                data[i + 2] = Math.min(data[i + 2] + randomIntensity, 255); // Blue
            }
        }

        ctx.putImageData(imageData, 0, 0);

        // Reuse frames: render current frame with stretching effect on part of the video
        if (frameCount % 5 === 0) {
            ctx.drawImage(video, 0, height * 0.5, width, height * 0.5, 0, height * 0.5, width, height * 0.5);
        }

        frameCount++;
    }, 1000 / 30); // 30 FPS
}

// Convert the video to WebM format (using FFmpeg.js in GitHub project)
function convertVideoToWebM() {
    // Implement FFmpeg.js to convert video to WebM
    // Add FFmpeg logic here (from your GitHub project import)

    // For example:
    // - Initialize FFmpeg
    // - Feed the recorded chunks into FFmpeg
    // - Export the result as WebM and allow download

    // This is a placeholder for integration with FFmpeg.js
    // After FFmpeg processing, trigger download:
    // const processedVideoBlob = ... (from FFmpeg processing);
    // downloadButton.href = URL.createObjectURL(processedVideoBlob);
    // downloadButton.download = 'glitched-video.webm';
}
