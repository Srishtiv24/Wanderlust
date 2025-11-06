const mongoose=require("mongoose");
const {Schema}=mongoose;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    //username,hashingfuncn,salt with password already defined by passport
    email:{
      type:String,
      required:true
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model("User",userSchema);