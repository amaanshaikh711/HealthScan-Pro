const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: "Get meal plan placeholder" }));
router.post('/generate', (req, res) => res.json({ message: "Generate AI plan placeholder" }));

module.exports = router;
