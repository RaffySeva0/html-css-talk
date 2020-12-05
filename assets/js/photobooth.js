var img, backgroundImage, video, prompt1, prompt2, screenshot, download, select, label, clear;
var enable = false;
const canvas = document.createElement('canvas');
var format = '.png'

const init = () => {
    hasGetUserMedia()
    if (enable){
        prompt1 = document.getElementById('prompt1');
        prompt2 = document.getElementById('prompt2');
        screenshot = document.getElementById('screenshot');
        clear = document.getElementById('clear');
        select = document.getElementsByTagName('select')[0]
        label = document.getElementsByTagName('label')[0]
        img = document.getElementsByTagName('img')[0];
        video = document.getElementsByTagName('video')[0];
        download = document.getElementsByClassName('download')[0]
        download.addEventListener('click', onDownload)
        document.getElementsByClassName('capture')[0].addEventListener('click', onCapture)
        screenshot.addEventListener('click', onScreenshot)
    }  
}

const hasGetUserMedia = () => {
    if (!navigator.mediaDevices && !navigator.mediaDevices.getUserMedia){
        alert('Unable to enable camera.')
    } else {
        enable = true
    }
}

const onCapture = () => {
    navigator.mediaDevices
    .getUserMedia({video: true})
    .then(stream => {
        video.srcObject = stream
        prompt1.style.display = 'none';
        prompt2.style.display = 'block';
        screenshot.disabled = false;
        clear.disabled = false;
    })
    .catch(err=>alert('Error occurred: ' + err));
}

const uploadBackground = () =>{
   var c = document.getElementById('canvasTwo');
   var ctx = c.getContext('2d');
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = () => {
            c.width = img.width;
            c.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);   
};

const onScreenshot = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext('2d').drawImage(video, 0, 0);
    prompt2.style.display = 'none'
    img.src = canvas.toDataURL('image/png');
    img.style.display = 'block'
    download.disabled = false
    select.style.visibility = 'visible'
    label.style.visibility = 'visible'
}

const onFormatChange = () =>{
    format = event.target.value
}

const onDownload = () => {
    download = document.createElement('a');
    download.href = img.src
    download.download = 'yourScreenshot' + format;
    download.style.display = 'none';
    // console.log(img.src);
    // console.log(img.src);
    // document.body.appendChild(download);
    // download.click();
    // document.body.removeChild(download);

    // if (data != "false") {  
    //     // Watermark START				
        watermark([img.src, '/assets/images/photobooth.png'])
          .dataUrl(watermark.image.lowerRight(0.5))
          .then((img)=>{
            download = document.createElement('a');
            download.href = img;
            download.download = `photobooth-ePHF2020`;
            download.style.display = 'none';
            document.body.appendChild(download);
            download.click();
            document.body.removeChild(download);
          });

        Swal.fire({
            icon: "success",
            text: "Your photobooth image has been saved as photobooth-ePHF2020.png in your downloads folder.",
            timer: 3000,
        });
    //     // Watermark END
    // } else {
    //     Swal.fire({
    //         icon: "error",
    //         text: "Uploaded image is invalid",
    //         timer: 3000,
    //     });
    // }

};

const clearAll = () => {
    video.srcObject.getVideoTracks().forEach(track => track.stop())
    // document.getElementsByClassName('container')[0].removeChild(video);
    // video = document.createElement("video")
    // video.autoplay = true
    // document.getElementsByClassName('container')[0].insertBefore(video, prompt1)
    if (img){
        img.style.display = 'none'
    }
    screenshot.disabled = true;
    download.disabled = true;
    select.style.visibility = 'hidden';
    label.style.display = 'none';
    format = null;
    prompt2.style.display = 'none';
    prompt1.style.display = 'block';
    // clear.disabled = true;
    
}

document.addEventListener('DOMContentLoaded', init)