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
    is_enabled: Boolean,
    last_login: Date
}, { timestamps: true })

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const passwordHash = bcryptjs.hashSync(this.get('password'), 10)
        this.set('password', passwordHash);
    }
    done();
})

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

// const rolesSchema
// const courseSchema
// const studentCourseSchema
// const studentAssessmentSchema

// const Schools = mongoose.model('schools', schoolSchema)
const User = mongoose.model('users', userSchema)

module.exports = {
    User
}
