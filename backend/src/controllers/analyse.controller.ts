import { Request, Response, NextFunction } from 'express'
import { analysisService } from '../services/analysis.service'
import logger from '../utils/logger'

export const analyseGame = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { test, pgn } = req.body
    
    // 1. Validate request body
    if (test === undefined && pgn === undefined) {
      res.status(400)
      throw new Error('Validation Error: Must provide either "test" flag or "pgn" string.')
    }

    if (test !== undefined && typeof test !== 'boolean') {
      res.status(400)
      throw new Error('Validation Error: "test" field must be a boolean.')
    }

    if (pgn !== undefined && typeof pgn !== 'string') {
      res.status(400)
      throw new Error('Validation Error: "pgn" field must be a string.')
    }

    logger.info(`[Backend] Processing analysis request: test = ${test}, pgn = ${pgn ? 'provided' : 'none'}`)
    
    // 2. Call Service layer
    const result = await analysisService.runAnalysis({ test, pgn })
    
    // 3. Return response
    res.status(200).json(result)
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(400)
    }
    next(error)
  }

}
