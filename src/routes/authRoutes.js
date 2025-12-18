const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    {string} username - Username (required)
 * @body    {string} email - Email address (required)
 * @body    {string} password - Password (required)
 * @body    {string} firstName - First name (optional)
 * @body    {string} lastName - Last name (optional)
 * @returns {Object} User data and JWT token
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 * @body    {string} email - Email address (required)
 * @body    {string} password - Password (required)
 * @returns {Object} User data and JWT token
 */
router.post("/login", login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private (requires valid JWT token)
 * @header  {string} Authorization - Bearer token (required)
 * @returns {Object} Current user information
 */
router.get("/me", protect, getMe);

module.exports = router;
