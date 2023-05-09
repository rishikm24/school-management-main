const { MongoClient } = require('mongodb')
const mongoose = require('mongoose')


module.exports = {
    connectDB: async (connectionUrl) => {
        try {
            await mongoose.connect(connectionUrl, {
                maxPoolSize: process.env.MONGO_DB_POOL_SIZE,
                useNewUrlParser: true,
                wtimeoutMS: 2500
            })
            console.log('MongoDB connected')
        } catch (err) {
            console.log('MongoDB connection err: ', err)
        }
    }
}