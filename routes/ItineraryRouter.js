const router = require("express").Router()
const controller = require("../controllers/ItineraryController")
const middleware = require("../middleware")

router.get(
  "/user/:userId",
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetUserItineraries
)

router.get(
  "/:id",
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetItineraryById
)

router.get("/", controller.GetItineraries)
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
