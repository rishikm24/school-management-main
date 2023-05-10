const express = require('express')
const router = express.Router()

const utils = require('./utils')
const userCtrl = require('../apis/user/user.ctrl')
const courseRouter = require('../apis/course/course.router')

router.post('/signup', userCtrl.signupUser)
router.post('/login', userCtrl.login)

router.use('/courses', utils.isAuthenticated, courseRouter)

module.exports = router