const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => res.json({ message: "Login placeholder" }));
router.post('/register', (req, res) => res.json({ message: "Register placeholder" }));

module.exports = router;
