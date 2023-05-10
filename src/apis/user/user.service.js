const bcryptjs = require('bcryptjs')
const { User } = require('../../models/schema')
const validator = require('validator')

class userService {
    static async validateUserDetails(userData) {
        try {
            let userCheck = await User.findOne({ email: userData.email })
            if (userCheck) {
                return { success: false, msg: 'User already exists' }
            }

            if (!userData.first_name) {
                return { success: false, msg: 'First name missing' }
            } else {
                let trimmed = userData.first_name.trim()
                if (trimmed.length > 25)
                    return { success: false, msg: 'Character limit exceeded' }
                userData.first_name = trimmed
            }

            if (!userData.last_name) {
                return { success: false, msg: 'Last name missing' }
            } else {
                let trimmed = userData.last_name.trim()
                if (trimmed.length > 25)
                    return { success: false, msg: 'Character limit exceeded' }
                userData.last_name = trimmed
            }

            if (!userData.email) {
                return { success: false, msg: 'Email missing' }
            } else if (!validator.isEmail(userData.email)) {
                return { success: false, msg: 'Invalid email' }
            }

            if (!userData.password) {
                return { success: false, msg: 'Password missing' }
            } else if (userData.password.length < 8) {
                return { success: false, msg: 'Password is too small' }
            }

            if (!validator.isMobilePhone(String(userData.mobile), ['en-IN'])) {
                return { success: false, msg: 'Invalid mobile number' }
            }
            userData.status = true

            return { success: true, userData }
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    static async addUserDetails(userData) {
        try {
            const hashedPassword = await bcryptjs.hash(userData.password, 10)
            const user = await User.create({ ...userData, password: hashedPassword })
            return user
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    static async authenticateUser(userData) {
        try {
            const userDetails = await User.findOne({ email: userData.email })
            if (!userDetails) {
                return { success: false, msg: 'User not registered' }
            }
            const passwordCheck = await bcryptjs.compare(userData.password, userDetails.password)
            if (!passwordCheck) {
                return { success: false, msg: 'Incorrect password' }
            }
            return { success: true, userDetails }
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    static async updateUser(userData) {
        try {
            if (userData.password) {
                const hashedPassword = await bcryptjs.hash(userData.password, 10)
                userData.password = hashedPassword
            }
            const user = await User.findByIdAndUpdate(userData._id, { ...userData }, { returnDocument: 'after' })
            return { success: true, data: user }
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

module.exports = userService