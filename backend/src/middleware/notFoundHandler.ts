import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

export const notFoundHandler = (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  logger.warn(`404 Not Found - ${req.method} ${req.originalUrl}`)
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  })
}

export default notFoundHandler
