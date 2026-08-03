import { Router } from 'express'
import { analyseGame } from '../controllers/analyse.controller'

const router = Router()

router.post('/', analyseGame)

export default router
