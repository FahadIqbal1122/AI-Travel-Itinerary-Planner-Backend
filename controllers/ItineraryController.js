const { GoogleGenerativeAI } = require("@google/generative-ai")
const { Itinerary } = require("../models")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Get all itineraries (for debugging/admin)
const GetItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({})
    res.json(itineraries)
  } catch (error) {
    console.error("Error fetching all itineraries:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get itineraries for specific user
const GetUserItineraries = async (req, res) => {
  try {
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    })

    console.log("Fetching itineraries for user:", req.params.userId) // Debug log

    const itineraries = await Itinerary.find({
      userId: req.params.userId,
    }).lean() // .lean() for better performance

    console.log("Found itineraries:", itineraries) // Debug log

    if (!itineraries.length) {
      console.log("No itineraries found for user") // Debug log
      return res.status(200).json([]) // Return empty array instead of "Connected!"
    }

    res.json(itineraries) // Return actual data
  } catch (error) {
    console.error("Error in GetUserItineraries:", error)
    res.status(500).json({ message: "Error fetching itineraries" })
  }
}

// Get single itinerary detail (with ownership check)
const GetItineraryDetail = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.itinerary_id).lean()

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" })
    }

    if (itinerary.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized - This itinerary doesn't belong to you",
      })
    }

    res.json(itinerary)
  } catch (error) {
    console.error("Error fetching itinerary detail:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Create new itinerary
const CreateItinerary = async (req, res) => {
  try {
    const itineraryData = {
      ...req.body,
      userId: req.user._id,
    }

    const itinerary = await Itinerary.create(itineraryData)
    res.status(201).json(itinerary)
  } catch (error) {
    console.error("Error creating itinerary:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Update itinerary
const UpdateItinerary = async (req, res) => {
  try {
    const existingItinerary = await Itinerary.findById(req.params.itinerary_id)

    if (!existingItinerary) {
      return res.status(404).json({ message: "Itinerary not found" })
    }

    if (existingItinerary.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.itinerary_id,
      req.body,
      { new: true }
    )

    res.json(updatedItinerary)
  } catch (error) {
    console.error("Error updating itinerary:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Delete itinerary
const DeleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.itinerary_id)

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" })
    }

    if (itinerary.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    await Itinerary.deleteOne({ _id: req.params.itinerary_id })
    res.json({
      message: "Itinerary deleted successfully",
      id: req.params.itinerary_id,
    })
  } catch (error) {
    console.error("Error deleting itinerary:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// generate itinerary using Google Generative AI
const GenerateItinerary = async (req, res) => {
  try {
    const { destination, startDate, endDate, preferences, isDraft } = req.body
    const userId = req.user._id

    // Validate required fields
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Date calculations
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1

    // AI Generation
    const prompt = `You are a travel expert. Generate a ${days}-day travel itinerary for ${destination} starting on ${startDate}.
The traveler prefers: ${preferences.join(", ")}.

Return ONLY a valid JSON array like this:

[
  {
    "day": 1,
    "title": "Cultural Kickoff",
    "date": "YYYY-MM-DD",
    "description": "Explore the city...",
    "timeSlots": {
      "morning": "Visit the museum",
      "afternoon": "Explore old town",
      "evening": "Dinner at local spot"
    },
    "location": "Main City Center"
  }
]` // Your existing prompt
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    const cleaned = response.replace(/```json|```/g, "").trim()
    const activities = JSON.parse(cleaned)

    // Return draft or save full itinerary
    if (isDraft) {
      return res.json({
        status: "draft",
        draft: activities,
        metadata: {
          userId,
          destination,
          startDate,
          endDate,
          preferences,
        },
      })
    }

    // Save to database
    const newItinerary = await Itinerary.create({
      userId,
      destination,
      startDate,
      endDate,
      preferences,
      activities,
    })

    res.status(201).json(newItinerary)
  } catch (err) {
    console.error("Server error:", err)
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    })
  }
}

const SaveItinerary = async (req, res) => {
  try {
    const { destination, startDate, endDate, preferences, activities, userId } =
      req.body

    const newItinerary = await Itinerary.create({
      userId,
      destination,
      startDate,
      endDate,
      preferences,
      activities,
      itineraryText: JSON.stringify(activities),
    })

    res.status(201).json(newItinerary)
  } catch (err) {
    console.error("Save error:", err)
    res.status(500).json({
      error: "Failed to save itinerary",
      details: err.message,
    })
  }
}

module.exports = {
  GetItineraries,
  GetUserItineraries,
  GetItineraryDetail,
  CreateItinerary,
  UpdateItinerary,
  DeleteItinerary,
  GenerateItinerary,
  SaveItinerary,
}
