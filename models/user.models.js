const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        // required: true,
        // minlength: 10,
        // maxlength: 15
    },
    city: {
        type: String,
    },
    create_at: {
        type: Date,
        default: new Date(),
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
