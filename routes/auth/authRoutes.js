const express = require('express');
const router = express.Router();
const { login, logout, checkSession, register} = require('../../controllers/authController');
const { ensureLoggedIn } = require('../../middleware/authMiddleware');

router.post('/login', login);
router.post('/logout', logout);
router.get('/check-session', checkSession);
router.post('/register', register);

module.exports = router;