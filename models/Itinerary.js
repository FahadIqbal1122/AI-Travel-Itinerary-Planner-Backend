const { Schema } = require("mongoose")

const travelSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    preferences: [String],
    itineraryText: { type: String },
    activities: [
      {
        day: Number, // Day 1, 2, 3...
        date: Date, // Specific date (e.g., 2024-07-10)
        title: String, // e.g., "Explore Shibuya"
        description: String, // Detailed activity notes
        timeSlots: {
          // Optional time breakdown
          morning: String,
          afternoon: String,
          evening: String,
        },
        location: String, // e.g., "Shibuya Crossing"
      },
    ],
  },
  { timestamps: true }
)

module.exports = travelSchema
