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

const createItineraries = async () => {
  // Generate random future dates (within next year)
  const getRandomFutureDate = () => {
    const today = new Date()
    const futureDate = new Date(today)
    futureDate.setDate(today.getDate() + Math.floor(Math.random() * 365) + 1)
    return futureDate
  }

  // List of realistic travel preferences
  const travelPreferences = [
    "adventure",
    "relaxation",
    "cultural",
    "food",
    "shopping",
    "nature",
    "history",
    "beach",
    "city exploration",
    "photography",
  ]

  // Generate random activities for each itinerary
  const generateActivities = (startDate, days) => {
    const activities = []
    for (let i = 0; i < days; i++) {
      const activityDate = new Date(startDate)
      activityDate.setDate(startDate.getDate() + i)

      activities.push({
        day: i + 1,
        date: activityDate,
        title: falso.randWord() + " activity",
        description: falso.randParagraph(),
        timeSlots: {
          morning: falso.randWord() + " in the morning",
          afternoon: falso.randWord() + " in the afternoon",
          evening: falso.randWord() + " in the evening",
        },
        location: falso.randCity(),
      })
    }
    return activities
  }

  // Create 10 random itineraries
  let itineraries = [...Array(10)].map(() => {
    const startDate = getRandomFutureDate()
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 14) + 3) // 3-17 day trips
    const tripDuration = Math.ceil(
      (endDate - startDate) / (1000 * 60 * 60 * 24)
    )

    return {
      userId: new mongoose.Types.ObjectId(), // Random new ObjectId
      destination: `${falso.randCity()}, ${falso.randCountry()}`,
      startDate: startDate,
      endDate: endDate,
      preferences: falso.rand(travelPreferences, { length: 3 }),
      itineraryText: falso.randParagraph(),
      activities: generateActivities(startDate, tripDuration),
    }
  })

  await Itinerary.deleteMany({})
  console.log("Creating itineraries . . .")
  await Itinerary.insertMany(itineraries)
  console.log(`${itineraries.length} itineraries created successfully!`)

  mongoose.connection.close()
}

createItineraries()
