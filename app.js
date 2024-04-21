const express = require("express")
const app = express();
const path = require("path")
require("dotenv").config()
require("./src/db/dbConnection")
const router = require('./src/routers')
const errorHandlerMW = require('./src/middlewares/errorHandler');
const apiLimiter = require("./src/middlewares/rateLimit");
const moment = require("moment-timezone");

moment.tz.setDefault("Europe/Istanbul")

// Middlewares
app.use(express.json())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

app.use(express.static(path.join(__dirname, "public")))
app.use("/uploads", express.static(__dirname))

app.use("/api", apiLimiter)

app.use("/api", router)


app.get("/", (req, res) => {
    res.json({
        message: "Hoş Geldiniz"
    })
})


// hata yakalama
app.use(errorHandlerMW)

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`Server ${port} portundan çalışıyor ...`);
})