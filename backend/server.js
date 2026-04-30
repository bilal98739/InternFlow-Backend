import express from 'express'
import cors from "cors"
import connectDB from './config/db.js'
import authRoutes from "./routes/authRoutes.js"
import internRoutes from "./routes/internRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"

const app = express()
app.use(cors({
  origin: /^http:\/\/localhost:\d+$/,
  allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json())

connectDB()

app.use("/api/auth",      authRoutes)
app.use("/api/interns",   internRoutes)
app.use("/api/tasks",     taskRoutes)
app.use("/api/dashboard", dashboardRoutes)

app.listen(5000, () =>{
    console.log("Server running on port 5000")
})