const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

//by default passport local mongoose adds username and password field(also hashed and salt)
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
