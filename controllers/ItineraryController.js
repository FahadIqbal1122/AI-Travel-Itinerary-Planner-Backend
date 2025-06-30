const mongoose = require("mongoose")
const { Itinerary } = require("../models")

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

    console.log("Fetching itineraries for user:", req.params.userId)

    const itineraries = await Itinerary.find({
      userId: req.params.userId,
    }).lean()

    console.log("Found itineraries:", itineraries)

    if (!itineraries.length) {
      console.log("No itineraries found for user")
      return res.status(200).json([])
    }

    res.json(itineraries)
  } catch (error) {
    console.error("Error in GetUserItineraries:", error)
    res.status(500).json({ message: "Error fetching itineraries" })
  }
}

const GetItineraryById = async (req, res) => {
  try {
    // Debug incoming request
    console.log("Request params:", req.params)
    console.log("User from token:", req.user)

    // Validate ID format
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid itinerary ID format",
        receivedId: req.params.id,
      })
    }

    const itinerary = await Itinerary.findById(req.params.id)
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" })
    }

    // Verify ownership
    if (itinerary.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" })
    }

    res.json(itinerary)
  } catch (error) {
    console.error("Controller error:", error)
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

module.exports = {
  GetItineraries,
  GetUserItineraries,
  CreateItinerary,
  UpdateItinerary,
  DeleteItinerary,
  GetItineraryById,
}
