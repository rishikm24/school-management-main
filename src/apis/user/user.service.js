const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../../models/schema')
const validator = require('validator')

class userService {
    static validateUserDetails(userData) {
        try {
            // TODO: add proper validation
            let userCheck = User.findOne({ email: userData.email })
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

            if (!validator.isMobilePhone(String(userData.mobile))) {
                return { success: false, msg: 'Invalid mobile number' }
            }

            return { success: true, userData }
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    static async addUserDetails(userData) {
        try {
            const hashedPassword = bcryptjs.hashSync(userData.password, 10)
            const user = await User.create({ ...userData, password: hashedPassword })
            return user._doc
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
            const passwordCheck = bcryptjs.compareSync(userData.password, userDetails.password)
            if (!passwordCheck) {
                return { success: false, msg: 'Incorrect password' }
            }
            return { success: true, userDetails }
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    static generateJwtToken(userId) {
        try {
            let token = jwt.sign({ userId }, process.env.TOKEN_SECRET, { expiresIn: '7 days' })
            return token
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

module.exports = userService