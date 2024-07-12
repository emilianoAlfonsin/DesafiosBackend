import { Router } from "express"
import UserController from "../controllers/user.controller.js"
import upload from "../config/multer.config.js"

const userRouter = Router()
const userController = new UserController()

userRouter.post('/premium:uid', userController.updateToPremium)

userRouter.post('/:uid/documents', upload.array('documents'), userController.uploadDocuments)


export default userRouter