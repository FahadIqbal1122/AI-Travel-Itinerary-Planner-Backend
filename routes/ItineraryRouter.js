const router = require("express").Router()
const controller = require("../controllers/ItineraryController")
const middleware = require("../middleware")

// Add this new route for user-specific itineraries
router.get(
  "/user/:userId",
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetUserItineraries
)

// Existing routes
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
