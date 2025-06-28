const router = require("express").Router()
const controller = require("../controllers/TravelController")

router.get("/", controller.GetTravels)
router.post("/", controller.CreateTravel)
router.put("/:travel_id", controller.UpdateTravel)
router.delete("/:travel_id", controller.DeleteTravel)

module.exports = router
