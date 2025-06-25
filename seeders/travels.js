const mongoose = require("mongoose")
const falso = require("@ngneat/falso")
const { Travel } = require("../models")
require("dotenv").config()

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB . . .")
  })
  .catch((e) => {
    console.error("Connection error", e.message)
  })

const createTravels = async () => {
  let travels = [...Array(10)].map((item, idx) => ({
    title: falso.randCatchPhrase().toString(),
    body: falso.randPhrase().toString(),
    image: `https://picsum.photos/500/500?random=${idx}`,
  }))

  await Travel.deleteMany({})
  console.log("Creating travels . . .")
  await Travel.insertMany(travels)
  console.log("Travel created!")

  mongoose.connection.close()
}

createTravels()
