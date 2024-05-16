const mongoose= require('mongoose')

const otp_schema= new mongoose.Schema({

  otp: {
    type: String,
    required: [true, "Please type the Otp"],
  },

  username: {
    type: String,
    required: [true, "Please type your name"],
  },
  email: {
    type: String,
    required: [true, "Please type your emil address"],
  },

  password: {
    type: String,
    required: [true, "Please type your password"],
  },

  createdAt: {
    type: Date,
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
  },

})


module.exports=mongoose.model("otps",otp_schema)