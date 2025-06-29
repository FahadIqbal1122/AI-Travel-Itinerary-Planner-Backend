const mongoose = require("mongoose")
const userSchema = require("./User")
const itinerarySchema = require("./Itinerary")

const User = mongoose.model("User", userSchema)
const Itinerary = mongoose.model("Itinerary", itinerarySchema)

module.exports = {
  Itinerary,
  User,
}
