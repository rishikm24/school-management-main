const { request, response } = require('express')
const { StatusCodes } = require('http-status-codes')

const courseService = require('./course.service')

class CourseCtrl {
    static async getAllCourses(req = request, res = response, next) {
        try {
            const courseDetails = await courseService.fetchCourses(req.query)
            return res.send(StatusCodes.OK, { success: true, data: courseDetails })
        } catch (err) {
            console.log(err)
            const msg = err.message || 'Error in getting courses'
            return res.send(StatusCodes.INTERNAL_SERVER_ERROR, { success: false, msg })
        }
    }

    static async createCourse(req = request, res = response, next) {
        try {
            const courseData = req.body
            const userId = req.userId
            if (!['Teacher', 'Principal'].includes(req.userRole)) {
                res.send(StatusCodes.BAD_REQUEST, { success: true, msg: 'Only Teachers/Principal allowed to create/modify courses' })
            }
            if (!userId) {
                res.send(StatusCodes.BAD_REQUEST, { success: true, msg: 'User ID missing' })
            }
            if (!courseData) {
                res.send(StatusCodes.BAD_REQUEST, { success: true, msg: 'Course details missing' })
            }
            const courseDetails = courseService.validateAndUpdateCourseData(userId, courseData)
            if (!courseDetails.success) {
                res.send(StatusCodes.BAD_REQUEST, { success: false, msg: courseDetails.msg })
            }
            const addedCourse = await courseService.addCourse(courseDetails.data)
            return res.send(StatusCodes.OK, { success: true, data: courseDetails })
        } catch (err) {
            console.log(err)
            const msg = err.message || 'Error in getting courses'
            return res.send(StatusCodes.INTERNAL_SERVER_ERROR, { success: false, msg })
        }
    }

    static async updateCourse(req = request, res = response, next) {
        try {
            const courseId = req.params.id
            const userId = req.userId
            if (!['Teacher', 'Principal'].includes(req.userRole)) {
                res.send(StatusCodes.BAD_REQUEST, { success: true, msg: 'Only Teachers/Principal allowed to create/modify courses' })
            }
            if (!userId) {
                res.send(StatusCodes.BAD_REQUEST, { success: true, msg: 'User ID missing' })
            }
            if (!courseId) {
                res.send(StatusCodes.BAD_REQUEST, { success: true, msg: 'Course ID missing' })
            }
            const courseData = req.body
            if (!courseData) {
                res.send(StatusCodes.BAD_REQUEST, { success: true, msg: 'Course details missing' })
            }
            const courseDetails = await courseService.updateCourseDetails(userId, courseId, courseData)
            if (!courseDetails.success) {
                res.send(StatusCodes.BAD_REQUEST, { success: true, msg: courseDetails.msg })
            }
            return res.send(StatusCodes.OK, { success: true, data: courseDetails.data })
        } catch (err) {
            console.log(err)
            const msg = err.message || 'Error in getting courses'
            return res.send(StatusCodes.INTERNAL_SERVER_ERROR, { success: false, msg })
        }
    }
}

module.exports = CourseCtrl