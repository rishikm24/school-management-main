const express = require('express')
const router = express.Router({ mergeParams: true })

const studentCtrl = require('./student.ctrl')

router.get('/enrol/:courseId', studentCtrl.courseEnrolment)
router.get('/unenrol/:courseId', studentCtrl.courseUnenrolment)

router.put('/quiz/:courseId', studentCtrl.enterQuizMarks)
router.put('/lesson/:courseId', studentCtrl.markLessonCompleted)

module.exports = router