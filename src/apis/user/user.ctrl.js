const { request, response } = require('express')
const { StatusCodes } = require('http-status-codes')
const userService = require('./user.service')
const utils = require('../../common/utils')

class UserCtrl {
    static async signupUser(req = request, res = response, next) {
        try {
            const validationResp = await userService.validateUserDetails(req.body)
            if (!validationResp.success) {
                return res.send(StatusCodes.BAD_REQUEST, { success: false, msg: validationResp.msg })
            }
            const userDetails = await userService.addUserDetails(validationResp.userData)
            return res.send(StatusCodes.OK, { success: true, data: userDetails })
        } catch (err) {
            console.log(err)
            const msg = err.message || 'Error in signing user'
            return res.send(StatusCodes.INTERNAL_SERVER_ERROR, { success: false, msg })
        }
    }

    static async login(req = request, res = response, next) {
        try {
            const validationResp = await userService.authenticateUser(req.body)
            if (!validationResp.success) {
                return res.send(StatusCodes.BAD_REQUEST, { success: false, msg: validationResp.msg })
            }
            const token = utils.generateJwtToken(validationResp.userDetails.id)
            // activate user on login if inactive
            if (validationResp.userDetails.status == false) {
                await userService.updateUser({ _id: validationResp.userDetails._id, status: true })
            }
            return res.send(StatusCodes.OK, { success: true, data: validationResp.userDetails, token })
        } catch (err) {
            console.log(err)
            const msg = err.message || 'Error in user login'
            return res.send(StatusCodes.INTERNAL_SERVER_ERROR, { success: false, msg })
        }
    }

    static async updateUser(req = request, res = response, next) {
        try {
            const validationResp = await userService.updateUser(req.body)
            return res.send(StatusCodes.OK, { success: true, data: validationResp.data })
        } catch (err) {
            console.log(err)
            const msg = err.message || 'Error in user update'
            return res.send(StatusCodes.INTERNAL_SERVER_ERROR, { success: false, msg })
        }
    }
}

module.exports = UserCtrl