const { Schema } = require("mongoose")

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    passwordDigest: { type: String },
    savedItineraries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
  },
  { timestamps: true }
)

module.exports = userSchema
