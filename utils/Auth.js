const User = require('../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../config');
const passport = require('passport')
// Desc to register a user(Admin, Superadmin, User)

const userRegister = async (userDets, role, res) => {
    try {
        //validate the user
        let userNameNotTaken = await validateUsername(userDets.username)
        if (!userNameNotTaken) {
            return res.status(400).json({
                message: "Username is already taken",
                success: false
            })
        }
        //validate the email
        let emailRegistered = await validateEmail(userDets.email)
        if (!emailRegistered) {
            return res.status(400).json({
                message: "Email is already registered",
                success: false
            })
        }

        // get the hased password 
        const password = await bcrypt.hash(userDets.password, 12)

        // create a new user
        let newUser = new User({
            ...userDets,
            password,
            role
        })
        await newUser.save();
        return res.status(200).json({
            message: "Hurray!! you are succesfully registerd",
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            message: "Not able to create your account",
            success: false
        })
    }
}

// Desc to login a user(Admin, Superadmin, User)

const userlogin = async (userCreds, role, res) => {
    let { username, password } = userCreds;
    // First check the user name is in the database
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({
            message: "Username is not found, Invallid creds",
            success: false
        })
    }

    //check the role in db
    if (user.role !== role) {
        return res.status(403).json({
            message: "Please make sure you are loggin in right portal",
            success: false
        })
    }
    //check for password ie; user is existing and trying to signin from the right portal
    let isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
        //sign in the token and issue it to the user
        let token = jwt.sign({
            user_id: user._id,
            role: user.role,
            username: user.username,
            email: user.email
        }, SECRET, { expiresIn: "7 days" }
        )

        let result = {
            username: user.username,
            role: user.role,
            email: user.email,
            token: `Bearer ${token}`,
            expiresIn: 168
        };
        return res.status(200).json({
            ...result,
            message: "Wow, You are logged in",
            success: true
        })
    } else {
        return res.status(403).json({
            message: "Incorrect password",
            success: false
        })
    }
}
const validateUsername = async (username) => {
    let user = await User.findOne({ username });
    return user ? false : true;
}

// passport middleware

const userAuth = passport.authenticate('jwt', { session: false });

// Check role midleware
const checkRole = roles => (req, res, next) => !roles.includes(req.user.role) ? res.status(401).json("Unauthorized") : next();


const validateEmail = async (email) => {
    let password = await User.findOne({ email });
    return password ? false : true;
}


const serializedUser = user => {
    return {
        username: user.username,
        email: user.email,
        name: user.name,
        _id: user._id,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
    }
}
module.exports = {
    checkRole,
    userAuth,
    userlogin,
    userRegister,
    serializedUser
}