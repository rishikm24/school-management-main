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
            const msg = err.msg || err.message || 'Error in student enrolment'
            const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR
            return res.send(status, { success: false, msg })
        }
    }
}

module.exports = studentCtrl