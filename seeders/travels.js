const mongoose = require("mongoose")
const falso = require("@ngneat/falso")
const { Itinerary } = require("../models")
require("dotenv").config()

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB . . .")
  })
  .catch((e) => {
    console.error("Connection error", e.message)
  })

const createItinerarys = async () => {
  let itinerarys = [...Array(10)].map((item, idx) => ({
    title: falso.randCatchPhrase().toString(),
    body: falso.randPhrase().toString(),
    image: `https://picsum.photos/500/500?random=${idx}`,
  }))

  await Itinerary.deleteMany({})
  console.log("Creating itinerarys . . .")
  await Itinerary.insertMany(itinerarys)
  console.log("Itinerary created!")

  mongoose.connection.close()
}

createItinerarys()
