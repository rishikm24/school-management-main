const { Course } = require("../../models/schema")
const { ObjectId } = require('mongodb')
class StudentService {
    static async enrolStudentInCourse(studentId, courseId) {
        try {
            const studentEnrolled = await Course.findOne({ _id: courseId, enrolled_students: [studentId] })
            if (studentEnrolled) {
                throw { status: 400, msg: 'Student already enrolled' }
            }
            await Course.updateOne({ _id: ObjectId(courseId) }, { $push: { enrolled_students: studentId } })
            return
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    static async unenrolStudent(studentId, courseId) {
        try {
            const studentEnrolled = await Course.findOne({ _id: courseId, enrolled_students: [studentId] })
            if (!studentEnrolled) {
                throw { status: 400, msg: 'Student not enrolled in this course' }
            }
            await Course.updateOne({ _id: ObjectId(courseId) }, { $pull: { enrolled_students: studentId } })
            return
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

module.exports = StudentService