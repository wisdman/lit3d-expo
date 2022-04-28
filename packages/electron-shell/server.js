const { parentPort, workerData } = require("worker_threads")

const { createServer } = require("https")
const { STATUS_CODES } = require("http")

const path = require("path")

const { createReadStream, createWriteStream, promises:fs } = require("fs")

const APP_SUFFIX = "/app"
const CONTENT_SUFFIX = "/content"
const INDEX_FILE = "index.html"

const CONFIG_PATH = path.resolve(__dirname, `./config.json`)

const APP_PATH = path.resolve(__dirname, `.${APP_SUFFIX}`)
const APP_INDEX =  path.join(APP_PATH, INDEX_FILE)

const CONTENT_DIR = path.resolve(__dirname, `.${CONTENT_SUFFIX}`)
const CONTENT_RX = new RegExp(`^${CONTENT_SUFFIX}(?<postfix>.*)`)

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".json": "application/json",
  
  ".ico": "image/x-icon",
  
  ".avif": "image/avif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  
  ".mkv": "video/x-matroska",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
}

const MIME_DEFAULT = "application/octet-stream"

const HEADERS = {
  "Cache-Control": "no-cache, must-revalidate, max-age=0",
}



async function filuUpload(request) {
  return new Promise((resolve, reject) => {
    const contentLength = Number.parseInt(request.headers["content-length"])
    if (Number.isNaN(contentLength) || contentLength <= 0 ) {
      return reject(411)
    }

    const ext = request.headers["extension"] ?? ""
    if (!ext) {
      console.error("Incorrect file extension")
      return reject(400)
    }

    const filename = Math.random().toString(36).substring(2, 15) 
                   + Math.random().toString(36).substring(2, 15) 
                   + "." + ext

    const fullFileName = path.resolve(CONTENT_DIR, `./${filename}`)
    const filestream = createWriteStream(fullFileName)

    filestream.on("error", (error) => {
      console.error(error)
      reject(400)
    })

    request.pipe(filestream)
    request.on("end", () => filestream.close(() => resolve(`${CONTENT_SUFFIX}/${filename}`)))
  })
}

async function setConfig(request) {
  return new Promise((resolve, reject) => {
    const chunks = []
    
    request.on("error", error => {
      console.error(error)
      reject(400)
    })
    
    request.on("data", chunk => chunks.push(chunk))
    
    request.on("end", () => {
      const data = Buffer.concat(chunks)
      
      const filestream = createWriteStream(CONFIG_PATH)
      
      filestream.on("error", (error) => {
        console.error(error)
        reject(400)
      })

      filestream.end(data)
      filestream.close(() => resolve())
    })
  })
}

async function staticServe(suffix, base) {
  const filePath = path.join(base, suffix)
  const stat = await fs.stat(filePath)
  if (stat.isDirectory()) {
    const indexSuffix = path.join(suffix, INDEX_FILE)
    return staticServe(indexSuffix, base)
  }

  const ext = path.extname(filePath)
  const mime = MIME[ext] ?? MIME_DEFAULT
  return [createReadStream(filePath), mime]
}

function router(request, response) {
  let suffix = path.normalize(request.url)

  // Get Config
  if (request.url === "/api/config" && request.method.toUpperCase() == "GET") {
    const fileStream = createReadStream(CONFIG_PATH)
    response.writeHead(200, {...HEADERS, "Content-Type": "application/json"})
    fileStream.pipe(response)
    return
  }

  // Set Config
  if (request.url === "/api/config" && request.method.toUpperCase() == "POST") {
    setConfig(request).then(() => {
      response.writeHead(204, {...HEADERS })
      response.end()
    }).catch(code => {
      esponse.writeHead(code, {...HEADERS, "Content-Type": "text/plain" })
      response.write(`${STATUS_CODES[code]}\n`)
      response.end()
    })
    return
  }

  // Upload file
  if (request.url === "/api/upload" && request.method.toUpperCase() == "POST") {
    filuUpload(request).then(filename => {
      response.writeHead(200, {...HEADERS, "Content-Type": "text/plain" })
      response.write(filename)
      response.end()
    }).catch(code => {
      response.writeHead(code, {...HEADERS, "Content-Type": "text/plain" })
      response.write(`${STATUS_CODES[code]}\n`)
      response.end()
    })
    return
  }

  // Content serve
  const contentMatch = CONTENT_RX.exec(request.url)
  if (contentMatch) {
    suffix = contentMatch.groups.postfix
    staticServe(suffix, CONTENT_DIR).then(([fileStream, mime]) => {
      response.writeHead(200, {...HEADERS, "Content-Type": mime })
      fileStream.pipe(response)
    }).catch(error => {
      if (error.code === "ENOENT") {
        response.writeHead(404, {...HEADERS, "Content-Type": "text/plain"})
        response.write("404 Not Found\n")
        response.end()
        return
      }

      response.writeHead(500, {...HEADERS, "Content-Type": "text/plain"})
      response.write("500 Internal Server Error\n")
      response.end()
      console.error(`ERROR: ${request.url} ${error}`)
    })
    return
  }

  // App serve
  staticServe(suffix, APP_PATH).then(([fileStream, mime]) => {
    response.writeHead(200, {...HEADERS, "Content-Type": mime})
    fileStream.pipe(response)
  }).catch(error => {
    if (error.code === "ENOENT") {
      const fileStream = createReadStream(APP_INDEX)
      response.writeHead(200, {...HEADERS, "Content-Type": "text/html" })
      fileStream.pipe(response)
      return
    }

    response.writeHead(500, {...HEADERS, "Content-Type": "text/plain"})
    response.write("500 Internal Server Error\n")
    response.end()
    console.error(`ERROR: ${request.url} ${error}`)
  })
}

void async function main() {
  const cert = await fs.readFile(path.resolve(__dirname, `./server.crt`))
  const key = await fs.readFile(path.resolve(__dirname, `./server.key`))
  const httpServer = createServer({ cert, key },router)
  await new Promise(resolve => httpServer.listen({ host: "localhost", port: workerData || 8080, exclusive: true, }, resolve))
  console.log(`Server listening https://localhost:${workerData || 8080}`)
  parentPort?.on("message", ({command} = {}) => command === "close" && httpServer.close())
  parentPort?.postMessage({ success: true })
}()
