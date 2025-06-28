const mongoose = require("mongoose")
const userSchema = require("./User")
const travelSchema = require("./Travel")

const User = mongoose.model("User", userSchema)
const Travel = mongoose.model("Travel", travelSchema)

module.exports = {
  Travel,
  User,
}
