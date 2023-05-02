const express = require('express')
const app = express()
require('dotenv').config()
const dbConfig = require("./config/dbConfig");
const port = process.env.port || 5000
app.use(express.json())

const userRoutes = require('./routes/usersRoute')
const busRoutes = require('./routes/busRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
app.use('/api/users/', userRoutes)
app.use('/api/buses/', busRoutes)
app.use('/api/bookings/', bookingRoutes)

app.listen(port, () => console.log(`server listening to ${port}`))