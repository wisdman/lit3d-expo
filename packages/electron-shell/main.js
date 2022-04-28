const {app, BrowserWindow, powerSaveBlocker, screen, globalShortcut, session} = require("electron")
const path = require("path")

const WINDOW_OPTIONS = require("./window-options.js")
const LOCAL_SERVER_PORT = 443
const URL = `https://localhost:${LOCAL_SERVER_PORT}/`

const powerSaveID = powerSaveBlocker.start("prevent-display-sleep")

app.commandLine.appendSwitch("disable-renderer-backgrounding")
app.commandLine.appendSwitch("enable-gpu-rasterization")
app.commandLine.appendSwitch("enable-native-gpu-memory-buffers")
app.commandLine.appendSwitch("enable-zero-copy")
app.commandLine.appendSwitch("force-device-scale-factor", "1")
app.commandLine.appendSwitch("force_high_performance_gpu")
app.commandLine.appendSwitch("ignore-certificate-errors")
app.commandLine.appendSwitch("ignore-connections-limit", `localhost`)
app.commandLine.appendSwitch("ignore-gpu-blacklist")
app.commandLine.appendSwitch("no-proxy-server")

app.on("ready", main)
app.on("window-all-closed", exit)

let windows = []

function exit() {
  windows.forEach(w => w.close())
  powerSaveBlocker.stop(powerSaveID)
  app.exit()
}

async function reload() {
  await session.defaultSession.clearStorageData()
  // windows.forEach(w => w.loadURL(SS_URL))
}

function getDisplays() {
  return screen.getAllDisplays()
               .sort(({bounds: {x: a}}, {bounds: {x: b}}) => a - b)
               .map(({bounds}, i) => ({...bounds, id: i + 1 }))
}

function startServer() {
  return new Promise((resolve, reject) => {
    const workerPath = path.join(__dirname, "server.js")
    serverWorker = new Worker(workerPath, {workerData: LOCAL_SERVER_PORT })
    serverWorker.on("error", reject)
    serverWorker.once("message", () => resolve(serverWorker))
  })
}

function createWindow (id = 0, {x = 0, y = 0, width = 800, height = 600} = {}) {
  let win = new BrowserWindow({ ...WINDOW_OPTIONS, x, y, width, height })

    win.on("closed", () => {
      windows = windows.filter(w => w !== win)
      win = null
    })

    win.removeMenu()
    win.loadURL(`${URL}#${id}`)
    win.show()
    
    windows.push(win)
}

async function initViewPorts() {
  
}

async function initGlobalShortcut() {
  globalShortcut.register("CommandOrControl+Q", exit)
  globalShortcut.register("F5", reload)
}

async function main() {
  try {
    await session.defaultSession.clearStorageData()
    await startServer()
    await initViewPorts()
    await initGlobalShortcut()
    process.on("SIGINT", exit)
  } catch (err) {
    console.error("App start error: ", err)
    console.trace(err)
  }
}
