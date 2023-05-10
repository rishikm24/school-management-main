const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')
const { User, Role } = require('../models/schema')

class Utils {
    static generateJwtToken(userId) {
        try {
            let token = jwt.sign({ userId }, process.env.TOKEN_SECRET, { expiresIn: '7 days' })
            return token
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    static async isAuthenticated(req, res, next) {
        try {
            const token = req.headers.authorization ? req.headers.authorization.replace('Bearer', '') : ''
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
            if (!decoded) {
                return res.send(StatusCodes.UNAUTHORIZED, { success: false, msg: "Could not identify user" })
            }
            req.userId = decoded.userId
            const userDetails = await User.findById(req.userId)
            const roleDetails = await Role.findById(userDetails.role_id)
            req.userRole = roleDetails.role_name
            return next()
        } catch (err) {
            console.log(err)
            const msg = err.message || err.msg || "Error in login"
            return res.send(StatusCodes.UNAUTHORIZED, { success: false, msg })
        }
    }


}

module.exports = Utils