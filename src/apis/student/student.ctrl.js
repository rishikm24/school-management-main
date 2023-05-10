const { StatusCodes } = require('http-status-codes')
const studentService = require('./student.service')

class studentCtrl {
    static async courseEnrolment(req, res, next) {
        try {
            if (req.userRole !== 'Student') {
                return res.send(StatusCodes.BAD_REQUEST, { success: false, msg: 'Only students can enrol for a course' })
            }
            const studentId = req.userId
            const courseId = req.params.courseId
            if (!courseId) {
                return res.send(StatusCodes.BAD_REQUEST, { success: false, msg: 'Course ID is missing' })
            }
            await studentService.enrolStudentInCourse(studentId, courseId)
            return res.send(StatusCodes.OK, { success: true, msg: 'Student enrollment successful' })
        } catch (err) {
            console.log(err)
            const msg = err.msg || err.message || 'Error in student enrolment'
            const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR
            return res.send(status, { success: false, msg })
        }
    }

    static async courseUnenrolment(req, res, next) {
        try {
            if (req.userRole !== 'Student') {
                return res.send(StatusCodes.BAD_REQUEST, { success: false, msg: 'Only students can opt out of a course' })
            }
            const studentId = req.userId
            const courseId = req.params.courseId
            if (!courseId) {
                return res.send(StatusCodes.BAD_REQUEST, { success: false, msg: 'Course ID is missing' })
            }
            await studentService.unenrolStudent(studentId, courseId)
            return res.send(StatusCodes.OK, { success: true, msg: 'Unenrollment successful' })
        } catch (err) {
            console.log(err)
            const msg = err.msg || err.message || 'Error in student unenrolment'
            const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR
            return res.send(status, { success: false, msg })
        }
    }

    static async enterQuizMarks(req, res, next) {
        try {
            if (req.userRole !== 'Student') {
                return res.send(StatusCodes.BAD_REQUEST, { success: false, msg: 'Only students can enter marks' })
            }
            const studentId = req.userId
            const courseId = req.params.courseId
            const quizData = req.body
            if (!courseId) {
                return res.send(StatusCodes.BAD_REQUEST, { success: false, msg: 'Course ID is missing' })
            }
            if (!quizData || !quizData.quiz_id || !quizData.marks_obtained) {
                return res.send(StatusCodes.BAD_REQUEST, { success: false, msg: 'Quiz data is missing' })
            }
            await studentService.enterQuizData(studentId, courseId, quizData)
            return res.send(StatusCodes.OK, { success: true, msg: 'Quiz entry successful' })
        } catch (err) {
            console.log(err)
            const msg = err.msg || err.message || 'Error in quiz entry'
            const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR
            return res.send(status, { success: false, msg })
        }
    }

    static async markLessonCompleted(req, res, next) {
        try {
            if (req.userRole !== 'Student') {
                return res.send(StatusCodes.BAD_REQUEST, { success: false, msg: 'Only students can enter marks' })
            }
            const studentId = req.userId
            const courseId = req.params.courseId
            const lessonData = req.body
            if (!courseId) {
                return res.send(StatusCodes.BAD_REQUEST, { success: false, msg: 'Course ID is missing' })
            }
            if (!lessonData || !lessonData.lesson_id || typeof lessonData.is_completed !== 'boolean') {
                return res.send(StatusCodes.BAD_REQUEST, { success: false, msg: 'Lesson data is missing' })
            }
            await studentService.enterLessonData(studentId, courseId, lessonData)
            return res.send(StatusCodes.OK, { success: true, msg: 'Lesson entry successful' })
        } catch (err) {
            console.log(err)
            const msg = err.msg || err.message || 'Error in lesson entry'
            const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR
            return res.send(status, { success: false, msg })
        }
    }

    static async getCourseProgress(req, res, next) {
        try {
            if (req.userRole !== 'Student') {
                return res.send(StatusCodes.BAD_REQUEST, { success: false, msg: 'Only students can enter marks' })
            }
            const studentId = req.userId
            const courseId = req.params.courseId
            if (!courseId) {
                return res.send(StatusCodes.BAD_REQUEST, { success: false, msg: 'Course ID is missing' })
            }
            const courseProgress = await studentService.getOverallCourseProgress(studentId, courseId)
            return res.send(StatusCodes.OK, { success: true, data: courseProgress })
        } catch (err) {
            console.log(err)
            const msg = err.msg || err.message || 'Error in getting course progress'
            const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR
            return res.send(status, { success: false, msg })
        }
    }
}

module.exports = studentCtrl