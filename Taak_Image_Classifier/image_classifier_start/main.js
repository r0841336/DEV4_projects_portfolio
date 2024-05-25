const video = document.getElementById('video');
const canvas = document.createElement('canvas');
const resultText = document.getElementById('result');
const captureBtn = document.getElementById('capture-btn');
const loader = document.querySelector('.loader'); 
let currentImg;

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    video.play();
  })
  .catch(err => {
    console.error('Error accessing the webcam:', err);
  });

function classifyImage(img) {
  const classifier = ml5.imageClassifier('MobileNet', () => {
    classifier.classify(img, (err, results) => {
      if (err) {
        console.error('Error classifying image:', err);
        resultText.innerText = 'Error classifying image';
      } else {
        console.log(results);
        resultText.innerText = `Class: ${results[0].label}`;
      }

      loader.style.display = 'none';
    });
  });
}

function takeAndClassifyPhoto() {
  loader.style.display = 'block'; 
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imgUrl = canvas.toDataURL('image/jpeg');

  if (currentImg) {
    currentImg.remove();
  }

  const img = new Image();
  img.onload = function() {
    classifyImage(img);
    currentImg = img;
  };
  img.src = imgUrl;
}

captureBtn.addEventListener('click', takeAndClassifyPhoto);
