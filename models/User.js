const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// Create Schema
const UserSchema = new Schema({
  name: {type: String,required: true},
  email: {type: String,required: true,    
    validator: (value) =>{
    if(!validator.isEamil(value)){
        throw new Error( { error:'Invalid Email Address'})
    }
 } 
},
  password: {type: String,required: true,minlength: 6},
  tokens:[{
    token:{type: String,require: true}
    }],
  date: {type: Date,default: Date.now}
});


//password middleware 
UserSchema.pre('save',async function(next){
  const user = this
  if(user.isModified('password')){
      // salt+hash encrpytion
      user.password = await bcrypt.hash(user.password, 10)
  }
  // continue
  next()
})

UserSchema.methods.generateAuthToken = async function(){
  const user = this
  const payload ={
      _id: user._id,
      email: user.email,
      admin: user.admin
  }
  const token = jwt.sign(payload,process.env.TOKEN_KEY,
      {
          expiresIn:'2h',
          issuer:'Awesome API v3'
      })
  user.tokens = user.tokens.concat({token})

  await user.save()

  return token
}

UserSchema.statics.findByCredentials = async (email,password) =>{
  try {
      const user = await User.findOne( {email} )
      if (!user){
          throw new Error()
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password)
      if(!isPasswordMatch){
          throw new Error()
      }

      return user
  } catch (error) {
      return null
      
  }
}




const User = mongoose.model('User', UserSchema)
//.model(export-name)
module.exports = User



