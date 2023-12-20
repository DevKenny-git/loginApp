const express = require("express");
const router = express.Router();
const {userCollection} = require("../schema/user");
const {send} = require("../utilities/mail");
const {v4: uuidv4} = require("uuid");
const {createOTP} = require("./otp");
const {createToken} = require("../usedToken");
require("dotenv").config();
const {registerValidation, otpValidation, loginValidation} = require("../validation");
const bcrypt = require("bcrypt");
const {otpCollection} = require("../schema/otpSchema");

router.post("/register", async (req, res) => {
    const {username, firstName, lastName, email, password} = req.body;

    const {error: registerValidationError} = registerValidation.validate({username, firstName, lastName, email, password});
    if (!registerValidation) return res.send(registerValidationError);

    let user = await userCollection.findOne({email});
    
    if (user) return res.send({status: false, msg: "User already exist, Login instead"});

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const token = uuidv4();
    const otp = createOTP()


    user = await userCollection.create({
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword
    });

    await otpCollection.create({
        otp: otp,
        userId: user._id,
        token: token
    });

    await send.sendMail({
        to: email,
        subject: "Account Verification",
        html: `
            Use this OTP code: ${otp} to verify your email.
        `
    })
    res.status(201).json({status: true, message: "user has been created, an OTP has been sent to your email for verification", token});
});

router.patch("/verify", async (req, res) => {
   try {
        const {otp, token} = req.body;

        const {error: otpValidationError} = otpValidation.validate({otp});

        if (!otpValidation) return res.send("OTP was sent to your email");

        const user = await otpCollection.findOne({otp, token});

        if (!user) return res.status(404).send("User not Found");

        await userCollection.findByIdAndUpdate(user.userId, {
            isVerified: true
        });

        await otpCollection.findOneAndDelete(otp);

        res.status(200).json({status: true, message: "User successfully Verified"});
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
        
    });


    router.post("/login", async (req, res) => {
        try {
            const {username, password} = req.body;

        const {error: loginValidationErr} = loginValidation.validate({username, password});
        if (!loginValidation) return res.send(loginValidationErr);

        const user = await userCollection.findOne(email);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                status: false,
                message: "User not Verified"
            });
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                status: false,
                message: "Invalid User Details"
            });
        }

        const accessToken = createToken(user);

        res.cookie(
            "access-token",
            accessToken, 
            {
                maxAge: 24 * 60 * 60,
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            }
        );

        return res.status(200).json({
            status: true,
            message: 'Login Successful'
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }    
})


router.get("/logout", async (req, res) => {
    try {
        res.clearCookie('access-token');
        res.status(200).json({
            status: true,
            message: "You are now Logged Out"
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});

module.exports = router;