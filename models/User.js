const { Schema } = require("mongoose")

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    passwordDigest: { type: String },
    savedTrips: { type: Array },
  },
  { timestamps: true }
)

module.exports = userSchema
