const HOST_URI = "https://mtn-finger-sdk.verxid.site/biometric-capture/";
// const EVENT_CHANNEL = "mLCXp9";
const KEY_VMN_MSG_CHANNEL = "vmn_msg_channel";
const DEFAULT_MSG_PAYLOAD = {
  [KEY_VMN_MSG_CHANNEL]: "",
  type: "CLOSE",
  data: {},
};
// const MSG_CAMERA_PERMISSION_NEEDED =
//   "Verxid Face Capture Widget needs access to your camera to proceed. Kindly go to your browser settings to allow access to your camera.";

if (typeof window === "object") {
  const customverxidPopupStyle = document.createElement("style");
  (customverxidPopupStyle.type = "text/css"),
    (customverxidPopupStyle.innerHTML = `
.verxidPopHolder {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 999999999999999;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
    border: none;
    overflow: auto;
}

.closeButton{
  cursor: pointer;
  height: 26px;
  width: 26px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255,255,255,0.4);
  margin-left: 5px;
  margin-top: -26px;
}

.closeButtonContainer{
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}


.loader {
  z-index: 9999999999999991;
  position: fixed;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: #fafafa;
  border-radius: 50%;
  width: 2em;
  height: 2em;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


.verxidPopFrame {
    width: 100%;
    height: 100%;
    max-width: 90%;
    max-height: 90%;
    z-index: 9999999999999992;
    overflow: auto;
    border: 0;
    border-radius: 5px;
}

@media only screen and (max-width: 600px) {
    .verxidPopFrame {
        max-width: none;
        max-height: none;
        border-radius: 0;
    }
    .closeButton{
      display: none;
    }
}
`),
    document
      .getElementsByTagName("head")[0]
      .appendChild(customverxidPopupStyle);
  // const HOST_URI = "https://mtn-face-sdk.verxid.site/biometric-capture/",
  // const EVENT_CHANNEL = "mLCXp9",
  // KEY_VMN_MSG_CHANNEL = "vmn_msg_channel",
  // DEFAULT_MSG_PAYLOAD = {
  //   [KEY_VMN_MSG_CHANNEL]: "",
  //   type: "CLOSE",
  //   data: {},
  // },
  // MSG_CAMERA_PERMISSION_NEEDED =
  //   "Verxid Face Capture Widget needs access to your camera to proceed. Kindly go to your browser settings to allow access to your camera.";
}
function removeElement(i) {
  i.parentNode && i.parentNode.removeChild(i), i && i.remove();
}
class verxidPopupSetup {
  constructor(e) {
    this.isCameraGranted = !1;
    this.customEventHandler = (e) => {
      this.handleLivenessPostMessage(e);
    };
    (this.webhook = String(e.webhook || "").trim()),
      (this.auth_key = String(e.auth_key || "").trim()),
      (this.identifier = String(e.identifier || "").trim()),
      (this.widgetType = String(e.widgetType || "").trim()),
      (this.finalCallback = e.callback || this.log),
      (this.onPopupClosed = e.onClose || this.log)
      // ,
      // this.init();
  }
  init() {
    this.clearMessageListener(), this.startup();
  }
  startup() {
    this.setup(), this.startExpress();
  }
  clearMessageListener() {
    window.removeEventListener("message", this.customEventHandler);
  }
  addMessageListener() {
    window.addEventListener("message", this.customEventHandler);
  }
  log(e) {
    console.log(e);
  }
  createCoreElements() {
    (this.frameHolder = window.document.createElement("div")),
      (this.frameHolder.className += " verxidPopHolder"),
      (this.verxidPopFrame = window.document.createElement("iframe")),
      (this.verxidPopFrame.className += " verxidPopFrame"),
      this.verxidPopFrame.setAttribute("allow", "camera *;microphone *"),
      (this.closeButton = window.document.createElement("span")),
      (this.closeButton.className += " closeButton"),
      (this.closeButton.innerHTML = `
    <svg width='14' height='13' viewBox='0 0 14 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M3.5 9.75L10.5 3.25' stroke='white' stroke-linecap='round' stroke-linejoin='round'/>
      <path d='M10.5 9.75L3.5 3.25' stroke='white' stroke-linecap='round' stroke-linejoin='round'/>
    </svg>`);
    let e = (n) => {
      n.preventDefault(), this.closePopup();
    };
    this.closeButton.removeEventListener("click", e),
      this.closeButton.addEventListener("click", e),
      (this.buttonContainer = window.document.createElement("div")),
      (this.buttonContainer.className += " closeButtonContainer"),
      this.buttonContainer.appendChild(this.closeButton),
      (this.lazyLoader = window.document.createElement("div")),
      (this.lazyLoader.className += " loader");
  }
  setup() {
    if (!this.webhook) throw new Error("Webhook is required");
    if (!this.auth_key) throw new Error("Auth_key is required");

    if (!this.identifier) throw new Error("Invalid value for identifier");

    this.addMessageListener();
  }
  startExpress() {
    this.createCoreElements(),
      this.frameHolder.appendChild(this.lazyLoader),
      this.frameHolder.appendChild(this.verxidPopFrame),
      this.frameHolder.appendChild(this.buttonContainer),
      (this.verxidPopFrame.src = `${HOST_URI}${this.generateUrlParams()}`),
      this.verxidPopFrame.addEventListener("load", () => {
        removeElement(this.lazyLoader);
      }),
      document.body.appendChild(this.frameHolder);
  }
  closePopup() {
    console.log("popup closed ==");
    removeElement(this.frameHolder),
      this.onPopupClosed(),
      this.clearMessageListener();
    //this.finalCallback({status:400,msg:"POP UP CLOSED"});
  }
  handleLivenessPostMessage(e) {
    this.finalCallback(e.data);
  }

  generateUrlParams() {
    let e = String(window.location.href).split("/");
    const t = {
      webhook: this.webhook,
      auth_key: this.auth_key,
      identifier: this.identifier,
    };
    return Object.keys(t)
      .map(function (r) {
        return encodeURIComponent(r) + "/" + encodeURIComponent(t[r]);
      })
      .join("/");
  }
}

export default verxidPopupSetup;
