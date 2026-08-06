import { Request, Response, NextFunction } from 'express'
import { analysisService } from '../services/analysis.service'
import { analysisQueueService } from '../services/analysisQueue.service'
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

    if (test) {
      logger.info('[Backend] Processing connection test request')
      const result = await analysisService.runAnalysis({ test })
      return res.status(200).json(result)
    }

    // PGN analysis trigger: Create background job
    logger.info(`[Backend] Enqueuing PGN analysis request`)
    const analysisId = analysisQueueService.createJob(pgn)
    
    res.status(202).json({
      success: true,
      message: 'Analysis job accepted and enqueued.',
      analysisId,
    })
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(400)
    }
    next(error)
  }
}

export const getAnalysisStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const job = analysisQueueService.getJob(id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Analysis job not found.',
      })
    }

    res.status(200).json({
      success: true,
      id: job.id,
      status: job.status,
      progress: job.progress,
      currentMove: job.currentMove,
      totalMoves: job.totalMoves,
      moves: job.moves,
      error: job.error,
    })
  } catch (error) {
    next(error)
  }
}

}
