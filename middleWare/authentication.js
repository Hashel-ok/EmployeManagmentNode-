const jwt=require('jsonwebtoken')

require('dotenv').config()


const authentication =((req,res,next) => {

try {

  const token=req.cookies.token||req.body.token
  
  if(!token)
{
//   return res.status(401).json({
//     success: false,
//     message: "Token Missing"
// })
return res.redirect('/user/login')

}

try {

  const decode= jwt.verify(token,process.env.JWTSECRET)
  req.user=decode;
  console.log(req.user)
  
} 

catch (error) {
  return res.status(401).json({
    success:false,
    message: "invalid Token "
})
}

next()



}
 catch (error) {

  return res.status(401).json({
    success:false,
    message: "Error Occured in Authentication"
})
  
}

})

module.exports=authentication;

