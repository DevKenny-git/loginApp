const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    otp: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    token: {
        type: String,
        required: true
    }
}, {timestamps: true});

const otpCollection = mongoose.model(otp, otpSchema);
 
module.exports = {otpCollection}