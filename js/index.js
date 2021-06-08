console.log(adapter.browserDetails.browser)
console.log(adapter.browserDetails.version)

class VideoRecorde {
  constructor(liveVideoId, mediaOption = {}, recorderOptions = {}) {
    this.liveVideoEle = document.querySelector(liveVideoId)
    // userMedia选项
    this.mediaOption = {
      audio: true,
      video: {
        width: 730,
        height: 460,
        facingMode: 'user', // 'user' 前置 'environment' 后置
        frameRate: { ideal: 10, max: 15 }, // 帧率
      },
      ...mediaOption
    }
    // mediaRecorder选项
    this.mediaRecorderOptions = {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
      mimeType: 'video/webm',
      ...recorderOptions
    }
  }
  openCamera(mediaOption = {}) {
    navigator.mediaDevices.getUserMedia({...this.mediaOption, ...mediaOption})
      .then((mediaStream) => {
        this._setLiveVideoSrc(mediaStream);
      })
      .catch(function(err) { console.log(`${err.name }: ${ err.message}`); }); // 总是在最后检查错误
  }
  closeCamera() {
    this.liveVideoEle.srcObject.getTracks().forEach((track) => { track.stop(); });
  };
  _setLiveVideoSrc(mediaStream) {
    // 旧的浏览器可能没有srcObject
    if ('srcObject' in this.liveVideoEle) {
      this.liveVideoEle.srcObject = mediaStream;
    } else {
    // 防止在新的浏览器里使用它，应为它已经不再支持了
      this.liveVideoEle.src = window.URL.createObjectURL(mediaStream);
    }
    this.liveVideoEle.onloadedmetadata = () => {
      this.liveVideoEle.play();
    };
  }
  startRecorde(option = {}) {
    this.mediaRecorder = new MediaRecorder(this.liveVideoEle.srcObject, {...this.mediaRecorderOptions, ...option});
    this.mediaRecorder.start()
  }
  endRecorde() {
    return new Promise((resolve) => {
      this.mediaRecorder.ondataavailable =  resolve
      this.mediaRecorder.stop()
    })
  }
}