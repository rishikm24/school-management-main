const express = require('express')
const router = express.Router()

const userCtrl = require('../apis/user/user.ctrl')

router.post('/signup', userCtrl.signupUser)
router.post('/login', userCtrl.login)

module.exports = router