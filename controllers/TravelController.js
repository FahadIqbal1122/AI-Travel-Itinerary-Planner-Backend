const { Travel } = require("../models")

const GetTravels = async (req, res) => {
  try {
    const travels = await Travel.find({})
    res.send(travels)
  } catch (error) {
    throw error
  }
}

const CreateTravel = async (req, res) => {
  try {
    const travel = await Travel.create({ ...req.body })
    res.send(travel)
  } catch (error) {
    throw error
  }
}

const UpdateTravel = async (req, res) => {
  try {
    const travel = await Travel.findByIdAndUpdate(
      req.params.travel_id,
      req.body,
      { new: true }
    )
    res.send(travel)
  } catch (error) {
    throw error
  }
}

const DeleteTravel = async (req, res) => {
  try {
    await Travel.deleteOne({ _id: req.params.travel_id })
    res.send({
      msg: "Travel Deleted",
      payload: req.params.travel_id,
      status: "Ok",
    })
  } catch (error) {
    throw error
  }
}

module.exports = {
  GetTravels,
  CreateTravel,
  UpdateTravel,
  DeleteTravel,
}
