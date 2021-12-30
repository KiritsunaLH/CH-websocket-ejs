const express = require("express")
const app = express()
const Socket = require('./utils/sockets')
const {Server: HttpServer} = require("http")
const path = require("path")
const httpserver = new HttpServer(app)
const socket = new Socket(httpserver)
const serverRoutes = require("./routes/index.js")

const PORT = process.env.PORT || 3000


socket.init()

//Settings
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("./views"))

app.set("views", path.join(__dirname, "views"))
app.set("view engine","ejs")

serverRoutes(app)

httpserver.listen(PORT,()=>{
    console.log(`Listening http://localhost:${PORT}`)
})