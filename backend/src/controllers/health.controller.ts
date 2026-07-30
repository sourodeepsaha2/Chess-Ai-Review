import { Request, Response, NextFunction } from 'express'

export const getHealth = (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      status: 'ok',
    })
  } catch (error) {
    next(error)
  }
}
