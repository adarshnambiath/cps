const express = require("express");
const { registerUser, loginUser, getProfile, updateHighScore, getHighScores, getAllScores } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.post("/updateHighScore", protect, updateHighScore);
router.get("/highScores",protect, getHighScores);
router.get("/scores",protect, getAllScores);

module.exports = router;