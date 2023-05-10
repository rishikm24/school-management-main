const { Course, studentLesson, studentQuiz } = require("../../models/schema")
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

    static async enterQuizData(student_id, course_id, { quiz_id, marks_obtained }) {
        try {
            const studentEnrolled = await Course.findOne({ _id: course_id, enrolled_students: [student_id] })
            if (!studentEnrolled) {
                throw { status: 400, msg: 'Student not enrolled in this course' }
            }
            await studentQuiz.updateOne({ student_id, course_id, quiz_id },
                {
                    $set: { marks_obtained }, $setOnInsert: { createdAt: new Date().toISOString() }
                }, { upsert: true })
            return
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    static async enterLessonData(student_id, course_id, { lesson_id, is_completed }) {
        try {
            const studentEnrolled = await Course.findOne({ _id: course_id, enrolled_students: [student_id] })
            if (!studentEnrolled) {
                throw { status: 400, msg: 'Student not enrolled in this course' }
            }
            await studentLesson.updateOne({ student_id, course_id, lesson_id },
                {
                    $set: { is_completed }, $setOnInsert: { createdAt: new Date().toISOString() }
                }, { upsert: true })
            return
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

module.exports = StudentService