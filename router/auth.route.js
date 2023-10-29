const router = require("express");
const bcrypt = require("bcryptjs");
const authroute = router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.models");
const nodemailer = require('nodemailer');
const queryModel = require("../models/query.model");


authroute.post("/register", async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            phoneNumber,
            city
        } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            fullName,
            email,
            password: hashedPassword,
            phoneNumber,
            city
        });
        await user.save()

        res.status(201).json({ message: "User created" });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

authroute.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({
            $or: [{ email: email }],
        });
        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }
        console.log(user)
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch, "isMatch")
        if (!isMatch) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        const token = jwt.sign({ userId: user._id, email: email, role: user.role }, process.env.JWT_SECRET);

        return res.status(200).send({
            message: "Login Successfully",
            token,
            user: user.role
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



authroute.post('/feedback', async (req, res) => {
    try {
        const { name, email, querydetails } = req.body;
        const user = new queryModel({
            name, email, querydetails
        });
        await user.save()
        res.status(200).json({
            message: 'Email sent successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = {
    authroute,
};
