import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoutes.js'

// initialize express 
const app = express()

const allowedOrigins = [
    process.env.FRONTEND_URLS,
    process.env.FRONTEND_URL,
    process.env.BACKEND_URLS,
    process.env.BACKEND_URL,
    'https://edemy-frontend-chi.vercel.app',
    'http://localhost:5173',
]
    .filter(Boolean)
    .flatMap((value) => value.split(','))
    .map((origin) => origin.trim())
    .filter(Boolean)

// Middlewares
app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server calls (no browser origin header) and configured frontend origins.
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
}))
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send('API working'))

let databaseConnection
app.use(async (req, res, next) => {
    if (!req.path.startsWith('/api/') && req.path !== '/clerk' && req.path !== '/stripe') {
        return next()
    }

    try {
        databaseConnection ??= connectDB()
        await databaseConnection
        await connectCloudinary()
        next()
    } catch (error) {
        databaseConnection = undefined
        next(error)
    }
})

// Routes
app.post('/clerk',express.json(),clerkWebhooks)
app.use('/api/educator',express.json(),educatorRouter)
app.use('/api/course',express.json(),courseRouter)
app.use('/api/user', express.json(),userRouter)
app.post('/stripe', express.raw({type: 'application/json'}),stripeWebhooks)

app.use((error, req, res, next) => {
    console.error(error)
    res.status(503).json({ message: 'Backend service unavailable' })
})

// Vercel uses the exported Express app. Keep listen support for local development.
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

export default app