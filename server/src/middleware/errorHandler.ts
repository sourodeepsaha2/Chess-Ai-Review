import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(
    `${err.message} - ${req.method} ${req.originalUrl} - IP: ${req.ip}\nStack: ${err.stack}`
  )

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  })
}

export default errorHandler
