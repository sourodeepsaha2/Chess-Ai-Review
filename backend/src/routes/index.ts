import { Router } from 'express'
import healthRoutes from './health.routes'
import analyseRoutes from './analyse.routes'

const router = Router()

router.use('/health', healthRoutes)
router.use('/analyse', analyseRoutes)

export default router
