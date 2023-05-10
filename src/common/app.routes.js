const express = require('express')
const router = express.Router()

const utils = require('./utils')
const userCtrl = require('../apis/user/user.ctrl')
const courseRouter = require('../apis/course/course.router')
const studentRouter = require('../apis/student/student.router')

router.post('/signup', userCtrl.signupUser)
router.post('/login', userCtrl.login)
router.post('/user/update', utils.isAuthenticated, userCtrl.updateUser)

router.use('/courses', utils.isAuthenticated, courseRouter)
router.use('/student', utils.isAuthenticated, studentRouter)

module.exports = router