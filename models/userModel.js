const mongoose= require('mongoose')

const user_schema=new mongoose.Schema({

  username:{ type:String,

    required:[true, 'username is mandatory']

  },
  email:{
    
    type:String,

    required:[true,'email is mandatory'],

    unique: true

  },
  password:{

    type:String,
    required:[true,'password is mandatory']

  },
  createdAt: { type: Date, default: Date.now }

})

const user=mongoose.model('user',user_schema);

module.exports=user;