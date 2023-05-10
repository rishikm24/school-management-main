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
            if (filter.studentId) {
                courseQuery.enrolled_students = [filter.studentId]
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
            if (courseData.lessons && courseData.lessons.length) {
                for (let lesson of courseData.lessons) {
                    if (!lesson.name) {
                        return { success: false, msg: 'Lesson name missing' }
                    }
                    if (!lesson.number) {
                        return { success: false, msg: 'Lesson number missing' }
                    }
                    if (!lesson.status) {
                        return { success: false, msg: 'Lesson status missing' }
                    }
                    lesson.created_by = lesson.updated_by = userId
                }
            } else {
                courseData.lessons = []
            }
            if (courseData.quizzes && courseData.quizzes.length) {
                for (let quiz of courseData.quizzes) {
                    if (!quiz.name) {
                        return { success: false, msg: 'Quiz name missing' }
                    }
                    if (!quiz.number) {
                        return { success: false, msg: 'Quiz number missing' }
                    }
                    if (!quiz.total_marks) {
                        return { success: false, msg: 'Quiz total marks missing' }
                    }
                    if (!quiz.status) {
                        return { success: false, msg: 'Quiz status missing' }
                    }
                    quiz.created_by = quiz.updated_by = userId
                }
            } else {
                courseData.quizzes = []
            }

            courseData.created_by = userId
            courseData.updated_by = userId
            courseData.enrolled_students = []
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
            //TODO: validation for quiz & lesson fields
            if (courseData.quizzes && Array.isArray(courseData.quizzes)) {
                updates.quizzes = courseCheck.quizzes
                for (let quiz of courseData.quizzes) {
                    if (!quiz._id) {
                        quiz.created_by = quiz.updated_by = userId
                        updates.quizzes.push(quiz)
                    } else {
                        let quizExists = courseCheck.quizzes.find(o => String(o._id) == String(quiz._id))
                        if (quiz.name) {
                            quizExists.name = quiz.name
                        }
                        if (quiz.number) {
                            quizExists.number = quiz.number
                        }
                        if (quiz.status) {
                            quizExists.status = quiz.status
                        }
                        if (quiz.total_marks) {
                            quizExists.total_marks = quiz.total_marks
                        }
                        quizExists.updated_by = userId
                    }
                }
            }
            if (courseData.lessons && Array.isArray(courseData.lessons)) {
                updates.lessons = courseCheck.lessons
                for (let lesson of courseData.lessons) {
                    if (!lesson._id) {
                        lesson.created_by = lesson.updated_by = userId
                        updates.lessons.push(lesson)
                    } else {
                        let lessonExists = courseCheck.lessons.find(o => String(o._id) == String(lesson._id))
                        if (lesson.name) {
                            lessonExists.name = lesson.name
                        }
                        if (lesson.number) {
                            lessonExists.number = lesson.number
                        }
                        if (lesson.status) {
                            lessonExists.status = lesson.status
                        }
                        lessonExists.updated_by = userId
                    }
                }
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