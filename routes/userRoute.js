const express=require('express')

const {user_signup,user_login,log_in_page,verifypage, verify_otp}=require('../controllers/userController')

const router=express.Router();


router.route('/user/signup').post(user_signup)
router.route('/user/login').get(log_in_page).post(user_login)

router.route('/user/signup/verify/:email').get(verifypage).post(verify_otp)


module.exports=router