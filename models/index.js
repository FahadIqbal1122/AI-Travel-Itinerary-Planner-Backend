const mongoose = require("mongoose")
const travelSchema = require("./Travel")

const Travel = mongoose.model("Travel", travelSchema)

module.exports = {
  Travel,
}
