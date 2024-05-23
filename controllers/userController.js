
const user=require('../models/userModel')

// const dotenv=require('dotenv').config()

const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const otp_generator=require('otp-generator')
const otps=require('../models/otpModel')
const nodemailer=require('nodemailer')

const flash=require('connect-flash')

const log_in_page=(req,res) => {
  const message=req.flash('message') 

  res.render('logInPage',{ message: message })
}


const verifypage=(req,res) => {

  const message=req.flash('message')
  res.render("verifyPage",{message:message})
}


let config={

  service:"gmail",

  auth:{

    user:process.env.EMAIL,
    pass:process.env.EMAIL_PASS

  },

};


let transporter=nodemailer.createTransport(config);



const send_otp_verification_code=async (email,res,req,username,password) => {

try{

  const otp_code=otp_generator.generate(4, { digits:true, lowerCaseAlphabets : false,upperCaseAlphabets :false, specialChars: false });
 
  
const mailoption={

  from:process.env.EMAIL,
  to:email,
  subject:"Verfiy your email",
  html: `<p> Enter <b>${otp_code}</b> in the app to verify your email address and complete the verification proccess `,
}

const saltround=10;
const hashedotp= await bcrypt.hash(otp_code,saltround);
const hashed_password=await bcrypt.hash(password,saltround)

const newotp_verification= await otps.create({

  otp:hashedotp,
  username:username,
  email:email,
  password:hashed_password,
  createdAt:Date.now(),
  expiresAt:Date.now()+3600000

})

await transporter.sendMail(mailoption);

req.session.message={

  type: "info",
      info: "Email has been send to your email please check your mail",
}
req.flash('message', req.session.message.info)
res.redirect("/user/signup/verify/"+email)

}
catch(error){
  console.log("unabe to send otp"+error);
}


}



//user signup

const user_signup=async (req,res) => {

  try{

    console.log(req.body)

    const {email,password,username}=req.body;


    if(!email||!password||!username){

     return req.session.message = {
        type: "info",
				message: "All Fields are required",

      }
      
    }
    else{
      const user_verification_record= await otps.findOne({email})

    const existing_user=await user.findOne({email});

    if(existing_user)
      {
        req.session.message = {
          type: "info",
          info: "You already have an account with this mail please login",
        };

        req.flash('message', req.session.message.info)
        res.redirect("/user/login");
      }
      else{
        if(user_verification_record){
          const expiresAt  = user_verification_record[0];
          if (expiresAt < Date.now()) {
            await otps.deleteMany({ email });
            SendOtpVerification(email, res, req, username, password);
        }
        else {
          req.session.message = {
            type: "info",
            info: "Email already been send to your email please check your mail",
          };
          req.flash('message', req.session.message.info)
          res.redirect("/user/signup/verify/" + email);
       
      }
    }
    else {
      send_otp_verification_code(email, res, req, username, password);
    }

         
  }
}

}

  catch(error)
  {
    console.log('Error in registering user', error)
    res.status(500).json({
      
      success: false,
      message : "User registration failed"})
  }


}




const verify_otp= async(req,res) => {

  const { otp1, otp2, otp3, otp4 } = req.body;

  const email = req.params.email;

  const typed_otp=`${otp1}${otp2}${otp3}${otp4}`

  const user_otp_record=await otps.find({email});

  console.log(user_otp_record)
 

  if(user_otp_record)
    {
      
      const { expiresAt,otp,password,username,email} = user_otp_record[0];
   

     
      if(expiresAt>Date.now()){
        const verified = await bcrypt.compare(typed_otp, otp);

        console.log(typed_otp)

        if (verified) {

    const create_user=await user.create({
      username,
      email,
      password

    })
     
        await otps.deleteMany({ email });

        req.session.message = {
          type: "success",
          info: "You are successfully registered please sign in",
        };
        req.flash('message', req.session.message.info)
        res.redirect("/user/login");
      } else {
        req.session.message = {
          type: "danger",
          info: "Invalid Otp please check your inbox",
        };
        req.flash('message', req.session.message.info)
        res.redirect("/user/signup/verify/" + email);
      }

      }

      

    }


}

// user login

const user_login=async (req,res) => {

  try {

    console.log(req.body)

    const {email,password}=req.body;


    if(!email||!password)
      {

      req.session.message={

          success:false,
          info:'Please fill email and password correctly'

        }
        req.flash('message', req.session.message.info)
        
        return res.redirect("/user/login");

      }

const user_exist=await user.findOne({email})

if(!user_exist){

  req.session.message = {
    type: "info",
  info: "You have to Signup First"}

  req.flash('message', req.session.message.info)
        
  return res.redirect("/user/login");

}

const payload={

  email:user_exist.email,
  id:user_exist._id

}

if(await bcrypt.compare(password,user_exist.password))
  {

    const token=jwt.sign(
      
      payload,
      process.env.JWTSECRET,
      {expiresIn:'2h'}
    )


   const userResponse = { ...user_exist.toObject(), token, password: undefined };

      const options={

        expires:new Date(Date.now()+3*24*60*60*1000),
        httponly:true // inorder to keep cookies not accessible in client side 
      }

    
      console.log(token)
  res.cookie("token",token,options)

    return res.redirect('/employees/dashboard');
  
    
  }
  else{

    return res.status(403).json({
      success: false,
      message: "Password incorrects"
  })
  }


    
  } 
  
  catch (error) {
    console.log('error in logging user',error)

    res.status(500).json({
      success: false,
      message: "Login failure:" + error
  })
  }



}



module.exports={user_login,user_signup,log_in_page,verify_otp,verifypage};


