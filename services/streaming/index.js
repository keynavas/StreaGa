const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose')

const app = express()
const PORT = 1111;

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }));
app.use(express.json())

const MONGODB_URI = ''

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log('mongoose is connected !!')
})

const streamRouter = require("./routes/stream")
app.use('/streams', streamRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})



