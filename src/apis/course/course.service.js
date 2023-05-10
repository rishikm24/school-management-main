const { Course } = require("../../models/schema")
const { ObjectId } = require('mongodb')
class CourseService {
    static async fetchCourses(filter) {
        try {
            let courseQuery = {}
            if (filter.id) {
                courseQuery._id = ObjectId(filter.id)
            }
            if (filter.name) {
                courseQuery.name = { '$regex': filter.name, "$options": 'i' }
            }
            if (filter.status) {
                let status = filter.status.includes('true')
                courseQuery.status = status
            }
            if (filter.createdBy) {
                courseQuery.created_by = filter.createdBy
            }
            let courseData = await Course.find(courseQuery)
            return courseData
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    static validateAndUpdateCourseData(userId, courseData) {
        try {
            if (!courseData.name) {
                return { success: false, msg: 'Course name missing' }
            }
            // TODO: check with DB course names
            if (typeof courseData.status !== 'boolean') {
                return { success: false, msg: 'Course status missing' }
            }
            if (!courseData.description) {
                courseData.description = ''
            }
            courseData.created_by = userId
            courseData.updated_by = userId
            return { success: true, data: courseData }
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    static async addCourse(courseData) {
        try {
            const addedCourse = await Course.create({ ...courseData })
            return addedCourse
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    static async updateCourseDetails(userId, courseId, courseData) {
        try {
            const updates = {}
            const courseCheck = await Course.findById(courseId)
            if (!courseCheck) {
                return { success: false, msg: 'Course not found' }
            }
            if (courseData.name) {
                updates.name = courseData.name
            }
            if (courseData.description) {
                updates.description = courseData.description
            }
            if (typeof courseData.status == 'boolean') {
                updates.status = courseData.status
            }
            updates.updated_by = userId
            const updatedCourse = await Course.findOneAndUpdate({ _id: ObjectId(courseId) }, { $set: updates }, { returnDocument: 'after' })
            return { success: true, data: updatedCourse }
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

module.exports = CourseService