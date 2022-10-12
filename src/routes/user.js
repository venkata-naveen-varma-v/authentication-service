const express = require('express')
const userController = require('../controllers/user')
const middleware = require('../middleware/auth')

const router = express.Router()

router.post('/register', userController.register)

module.exports = router;