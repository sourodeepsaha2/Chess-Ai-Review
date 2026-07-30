import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import logger from './utils/logger'
import routes from './routes'
import errorHandler from './middleware/errorHandler'
import notFoundHandler from './middleware/notFoundHandler'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Morgan HTTP request logs integrated with Winston
const morganStream = {
  write: (message: string) => logger.http(message.trim()),
}
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: morganStream,
  })
)

// API Routes
app.use(routes)

// Fallbacks
app.use(notFoundHandler)
app.use(errorHandler)

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
})
