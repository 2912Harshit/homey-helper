const mongoose = require('mongoose')
require('dotenv').config()

const mongoURI = process.env.MONGODB_URI

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(mongoURI, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        })
        console.log('Connected with the database')
    } catch (error) {
        console.error('Database connection error:', error)
        // Add more detailed error information
        if (error.name === 'MongoNetworkError') {
            console.error('Network error. Please check your internet connection and MongoDB Atlas network access settings.')
        } else if (error.name === 'MongoServerSelectionError') {
            console.error('Could not connect to MongoDB Atlas. Please check your connection string and network settings.')
        }
        process.exit(1)
    }
}

mongoose.connection.on("connected", function () {
    console.log("Application is connected to Database")
})

mongoose.connection.on("error", function (err) {
    console.error("MongoDB connection error:", err)
})

mongoose.connection.on("disconnected", function () {
    console.log("MongoDB disconnected")
})

process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
})

module.exports = connectDB

