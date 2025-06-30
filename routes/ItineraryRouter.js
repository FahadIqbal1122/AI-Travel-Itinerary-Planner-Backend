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
  (req, res, next) => {
    // Direct verification (bypassing potential middleware issues)
    try {
      const token = req.headers.authorization?.split(" ")[1]
      if (!token) return res.status(401).send("No token")

      const decoded = jwt.verify(token, process.env.APP_SECRET)
      req.user = decoded.user // Manual attachment
      next()
    } catch (err) {
      res.status(401).send("Invalid token")
    }
  },
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
