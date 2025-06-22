const mongoose = require("mongoose");
const passport = require("passport");
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type : String,
        require : true,
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);