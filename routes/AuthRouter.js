const router = require("express").Router()
const controller = require("../controllers/AuthController")
const { verifyToken } = require("../middleware")

router.post("/login", controller.Login)
router.post("/register", controller.Register)
router.get("/session", verifyToken, controller.CheckSession)

module.exports = router
