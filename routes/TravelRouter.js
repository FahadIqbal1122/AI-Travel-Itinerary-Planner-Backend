const router = require("express").Router()
const controller = require("../controllers/TravelController")
const middleware = require("../middleware")

router.get("/", controller.GetTravels)
router.post(
  "/",
  middleware.stripToken,
  middleware.verifyToken,
  controller.CreateTravel
)
router.put(
  "/:travel_id",
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdateTravel
)
router.delete(
  "/:travel_id",
  middleware.stripToken,
  middleware.verifyToken,
  controller.DeleteTravel
)

module.exports = router
