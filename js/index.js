console.log(adapter.browserDetails.browser)
console.log(adapter.browserDetails.version)

class Camera {
  constructor(liveVideoId, mediaOption = {}, recorderOptions = {}) {
    this.liveVideoEle = document.querySelector(liveVideoId)
    // 
    this.mediaOption = {
      audio: true,
      video: {
        width: 750,
        height: 350,
        facingMode: 'user', // 'user' 前置 'environment' 后置
        frameRate: { ideal: 10, max: 15 }, // 帧率
      },
      ...mediaOption
    }
    this.mediaRecorderOptions = {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
      mimeType: 'video/webm',
      ...recorderOptions
    }
  }
  openCamera(mediaOption = {}) {
    navigator.mediaDevices.getUserMedia({...this.mediaOption, ...mediaOption})
      .then(function(mediaStream) {
        this._setLiveVideoSrc(mediaStream);
      })
      .catch(function(err) { console.log(`${err.name }: ${ err.message}`); }); // 总是在最后检查错误
  }
  closeCamera() {
    this.liveVideoEle.srcObject.getTracks().forEach((track) => { track.stop(); });
  };
  _setLiveVideoSrc(srcObject) {
    // 旧的浏览器可能没有srcObject
    if ('srcObject' in this.liveVideoEle) {
      this.liveVideoEle.srcObject = srcObject;
    } else {
    // 防止在新的浏览器里使用它，应为它已经不再支持了
      this.liveVideoEle.src = window.URL.createObjectURL(srcObject);
    }
    this.liveVideoEle.onloadedmetadata = function() {
      this.liveVideoEle.play();
    };
  }
  _createMediaRecorder() {
    this.mediaRecorder = new MediaRecorder(this.liveVideoEle.srcObject, this.mediaRecorderOptions);
  }
  startRecorde() {
    const _this = this
    this._createMediaRecorder()
    return new Promise((resolve, reject) => {
      _this.mediaRecorder = dataAvailable = (blob) => {
        resolve(blob.data)
      }
    })
  }
  endRecorde() {
    console.log(this.mediaRecorder.stop());
  }
  dataAvailable = (blob) => {
    setPreviewVideoSrc(blob.data);
  };
}