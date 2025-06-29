const router = require("express").Router()
const controller = require("../controllers/ItineraryController")
const middleware = require("../middleware")

router.get("/", controller.GetItinerarys)
router.post(
  "/",
  middleware.stripToken,
  middleware.verifyToken,
  controller.CreateItinerary
)
router.put(
  "/:itinerary_id",
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdateItinerary
)
router.delete(
  "/:itinerary_id",
  middleware.stripToken,
  middleware.verifyToken,
  controller.DeleteItinerary
)

module.exports = router
