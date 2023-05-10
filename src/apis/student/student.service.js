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

    static async getOverallCourseProgress(student_id, course_id) {
        try {
            const studentEnrolled = await Course.findOne({ _id: course_id, enrolled_students: [student_id] })
            if (!studentEnrolled) {
                throw { status: 400, msg: 'Student not enrolled in this course' }
            }
            let [lessonPlans, quizzes] = await Promise.all([
                studentLesson.find({ student_id, course_id }, {}),
                studentQuiz.find({ student_id, course_id }, {})
            ])
            let updatedLessons = []
            for (let lesson of lessonPlans) {
                let lessonExists = studentEnrolled.lessons.find(o => String(o._id) == String(lesson.lesson_id))
                if (lessonExists) {
                    let lessonObj = { ...lesson, name: lessonExists.name, number: lessonExists.number }
                    updatedLessons.push(lessonObj)
                }
            }
            let updatedQuizzes = []
            for (let quiz of quizzes) {
                let quizExists = studentEnrolled.quizzes.find(o => String(o._id) == String(quiz.quiz_id))
                if (quizExists) {
                    let quizObj = { ...quiz, name: quizExists.name, number: quizExists.number, total_marks: quizExists.total_marks }
                    updatedQuizzes.push(quizObj)
                }
            }
            studentEnrolled.lessons = updatedLessons
            studentEnrolled.quizzes = updatedQuizzes
            return studentEnrolled
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

module.exports = StudentService