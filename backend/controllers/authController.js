const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { get } = require("mongoose");

//token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ id: user._id, username: user.username, token: generateToken(user._id) });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ id: user._id, username: user.username, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const updateHighScore = async (req, res) => {
  const { userId, game, score } = req.body;

  try {
    const user = await User.findById(userId);
    if (user) {
      if (game === "reaction") {
        if (user.highScoreReaction === -1) {
          user.highScoreReaction = score;
        }
        else
        user.highScoreReaction = Math.min((user.highScoreReaction), score);
        user.scoresReaction.push(score);
      } else if (game === "clicker") {
        user.highScoreClicker = Math.max(user.highScoreClicker, score);
        user.scoresClicker.push(score);
      } else if (game === "aim") {
        user.highScoreAim = Math.max(user.highScoreAim, score);
        user.scoresAim.push(score);
      }
      await user.save();
      res.json({ message: "High score updated", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating high score:", error.message);
    res.status(500).json({ message: "Error updating high score", error: error.message });
  }
};

const getHighScores = async (req, res) => {
  try {
    const users = await User.find().select("username highScoreReaction highScoreClicker highScoreAim");
    res.json(users);
  } catch (error) {
    console.error("Error retrieving high scores:", error.message);
    res.status(500).json({ message: "Error retrieving high scores", error: error.message });
  }
};

const getAllScores = async (req, res) => {
  const user = await User.findById(req.user.id).select("scoresReaction scoresClicker scoresAim");
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const getUsername= async (req, res) => {
  const user  = await User.findById(req.user.id).select("username");
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateHighScore, getHighScores , getAllScores,getUsername};