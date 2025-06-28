const { Schema } = require("mongoose")

const travelSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String },
    image: { type: String },
  },
  { timestamps: true }
)

module.exports = travelSchema
