const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const bcryptjs = require('bcryptjs')

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    mobile: { type: Number, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    address: String,
    city: String,
    state: String,
    pincode: String,
    school_name: { type: String, required: true },
    role_id: { type: ObjectId, required: true },
    status: Boolean,
    last_login: Date
}, { timestamps: true })

const lessonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: Number, required: true },
    created_by: { type: ObjectId, required: true },
    updated_by: { type: ObjectId, required: true },
    status: { type: Boolean, required: true },
    is_completed: { type: Boolean }
}, { timestamps: true })

const quizSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: Number, required: true },
    total_marks: { type: Number, required: true },
    created_by: { type: ObjectId, required: true },
    updated_by: { type: ObjectId, required: true },
    status: { type: Boolean, required: true },
    marks_obtained: { type: Number }
}, { timestamps: true })

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    status: { type: Boolean, required: true },
    enrolled_students: { type: [ObjectId] },
    lessons: { type: [lessonSchema] },
    quizzes: { type: [quizSchema] },
    created_by: { type: ObjectId, required: true },
    updated_by: { type: ObjectId, required: true }
}, { timestamps: true })

const studentLessonSchema = new mongoose.Schema({
    student_id: { type: ObjectId, required: true },
    lesson_id: { type: ObjectId, required: true },
    course_id: { type: ObjectId, required: true },
    is_completed: { type: Boolean, required: true }
}, { timestamps: true })

const studentQuizSchema = new mongoose.Schema({
    student_id: { type: ObjectId, required: true },
    quiz_id: { type: ObjectId, required: true },
    course_id: { type: ObjectId, required: true },
    marks_obtained: { type: Number, required: true }
}, { timestamps: true })


const roleSchema = new mongoose.Schema({
    role_name: { type: String, required: true },
    role_code: { type: String, required: true },
    status: { type: Boolean, required: true }
}, { timestamps: true })

const User = mongoose.model('users', userSchema)
const Course = mongoose.model('courses', courseSchema)
const Role = mongoose.model('roles', roleSchema)
const studentLesson = mongoose.model('student_lessons', studentLessonSchema)
const studentQuiz = mongoose.model('student_quizzes', studentQuizSchema)

module.exports = {
    User, Course, Role, studentLesson, studentQuiz
}
