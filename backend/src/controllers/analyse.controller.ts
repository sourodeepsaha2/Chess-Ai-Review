import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

export const analyseGame = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { test } = req.body
    
    logger.info(`[Backend] Received analysis request: test = ${test}`)
    
    res.status(200).json({
      success: true,
      message: 'Analysis connection verified successfully',
      test: !!test,
      timestamp: Date.now(),
    })
  } catch (error) {
    next(error)
  }
}
