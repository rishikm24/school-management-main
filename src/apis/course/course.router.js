const express = require('express')
const router = express.Router({ mergeParams: true })

const courseCtrl = require('./course.ctrl')

router.get('/', courseCtrl.getAllCourses)
router.post('/', courseCtrl.createCourse)
router.put('/:id', courseCtrl.updateCourse)

module.exports = router