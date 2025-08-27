import { Router } from 'express'
import { registerUserController } from '../controllers/user.controller.js'
import { verifyEmailController } from '../controllers/user.controller.js'
import { loginController } from '../controllers/user.controller.js'
import { logoutController } from '../controllers/user.controller.js'
import { uploadAvatar,updateUserDetails,forgotPasswordController,verifyForgotPasswordOtp,resetpassword,refreshToken,userDetails} from '../controllers/user.controller.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/multer.js'




const userRouter = Router()


userRouter.post('/register',registerUserController)
//If  backend URL is http://localhost:5000, then:
//POST http://localhost:5000/register → will trigger the registerUserController function to register a new user.
userRouter.post('/verify-email',verifyEmailController)
userRouter.post('/login',loginController)
userRouter.get('/logout',auth,logoutController)
userRouter.put('/upload-avatar',auth,upload.single('avatar'),uploadAvatar) //i want to update it so put method
userRouter.put('/update-user',auth,updateUserDetails)
userRouter.put('/forgot-password',forgotPasswordController)
userRouter.put('/verify-forgot-password-otp',verifyForgotPasswordOtp)
userRouter.put('/reset-password',resetpassword)
userRouter.post('/refresh-token',refreshToken)
userRouter.get('/user-details',auth,userDetails)











export default userRouter