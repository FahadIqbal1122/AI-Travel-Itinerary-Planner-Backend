const express = require("express")
const logger = require("morgan")
const cors = require("cors")

const AuthRouter = require("./routes/AuthRouter")
const ItineraryRouter = require("./routes/ItineraryRouter")

const PORT = process.env.PORT || 3001

const db = require("./db")

const app = express()

app.use(cors())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/auth", AuthRouter)
app.use("/itineraries", ItineraryRouter)

app.use("/", (req, res) => {
  res.status(404).json({ message: "Not Found" })
})

app.listen(PORT, () => {
  console.log(`Running Express server on Port ${PORT} . . .`)
})
