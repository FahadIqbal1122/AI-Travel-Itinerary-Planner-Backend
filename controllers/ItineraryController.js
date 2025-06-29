const { Itinerary } = require("../models")

const GetItinerarys = async (req, res) => {
  try {
    const itinerarys = await Itinerary.find({})
    res.send(itinerarys)
  } catch (error) {
    throw error
  }
}

const CreateItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.create({ ...req.body })
    res.send(itinerary)
  } catch (error) {
    throw error
  }
}

const UpdateItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndUpdate(
      req.params.itinerary_id,
      req.body,
      { new: true }
    )
    res.send(itinerary)
  } catch (error) {
    throw error
  }
}

const DeleteItinerary = async (req, res) => {
  try {
    await Itinerary.deleteOne({ _id: req.params.itinerary_id })
    res.send({
      msg: "Itinerary Deleted",
      payload: req.params.itinerary_id,
      status: "Ok",
    })
  } catch (error) {
    throw error
  }
}

module.exports = {
  GetItinerarys,
  CreateItinerary,
  UpdateItinerary,
  DeleteItinerary,
}
