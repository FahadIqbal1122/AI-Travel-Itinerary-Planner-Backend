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
  "/:itinerary_id",
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetItineraryDetail
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

router.post(
  "/generate",
  middleware.stripToken,
  middleware.verifyToken,
  controller.GenerateItinerary
)

router.post(
  "/itineraries",
  middleware.stripToken,
  middleware.verifyToken,
  controller.SaveItinerary
)

router.post(
  "/edit/:id",
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetItineraryForEdit
)

module.exports = router
