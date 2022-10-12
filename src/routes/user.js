const express = require('express')
const userController = require('../controllers/user')
const middleware = require('../middleware/auth')

const router = express.Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', middleware.auth, userController.logout)
router.post('/details', middleware.auth, userController.userdetails)

module.exports = router;