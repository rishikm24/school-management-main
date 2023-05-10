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

// const schoolSchema = new mongoose.Schema({
//     name: String,
//     code: String,
//     telephone: Number,
//     email: String,
//     address: String,
//     city: String,
//     state: String,
//     pincode: String,
//     status: Boolean
// }, { timestamps: true })

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    status: { type: Boolean, required: true },
    enrolled_students: { type: [ObjectId] },
    created_by: { type: ObjectId, required: true },
    updated_by: { type: ObjectId, required: true }
}, { timestamps: true })

const roleSchema = new mongoose.Schema({
    role_name: { type: String, required: true },
    role_code: { type: String, required: true },
    status: { type: Boolean, required: true }
}, { timestamps: true })

// const studentCourseSchema
// const assessmentSchema
// const studentAssessmentSchema

// const Schools = mongoose.model('schools', schoolSchema)
const User = mongoose.model('users', userSchema)
const Course = mongoose.model('courses', courseSchema)
const Role = mongoose.model('roles', roleSchema)

module.exports = {
    User, Course, Role
}
