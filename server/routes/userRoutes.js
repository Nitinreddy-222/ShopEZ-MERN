const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, protect, admin } = require('../controllers/usercontroller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, admin, getUsers);

module.exports = router;
