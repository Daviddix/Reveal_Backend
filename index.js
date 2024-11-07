const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const cors = require("cors")
require("dotenv").config()

//middlewares
app.use(cors())
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}))

//routers
const summaryRouter = require("./routes/summary")

//routes
app.use("/api/summary", summaryRouter)


app.listen(PORT, () => {
    console.log('App listening on port 3000!');
});