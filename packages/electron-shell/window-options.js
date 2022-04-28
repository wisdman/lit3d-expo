module.exports = {
  autoHideMenuBar: true,
  center: false,
  closable: false,
  enableLargerThanScreen: true,
  frame: false,
  fullscreenable: true,
  maximizable: false,
  minimizable: false,
  movable:false,
  resizable: false,
  skipTaskbar: true,
  thickFrame: false,

  backgroundColor: "#ffffff",
  titleBarStyle: "hidden",

  webPreferences: {
    defaultEncoding: "utf8",

    devTools: true,
    nodeIntegration: false,
    nodeIntegrationInWorker: false,
    nodeIntegrationInSubFrames: false,
    enableRemoteModule: false,

    backgroundThrottling: false,
    spellcheck: false,

    experimentalFeatures: false,
    disableDialogs: true,
  },
}