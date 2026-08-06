import { Router } from 'express'
import { analyseGame, getAnalysisStatus } from '../controllers/analyse.controller'

const router = Router()

router.post('/', analyseGame)
router.get('/status/:id', getAnalysisStatus)

export default router

