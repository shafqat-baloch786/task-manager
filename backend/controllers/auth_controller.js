const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../utils/generate_token.js');


// User resgistration
const register = async (request, response) => {
    const {name, email, password} = request.body;
    try {
        // checking if user exists
        const userExists = await User.findOne({email});
        if (userExists) {
            return response.status(400).json({
                message: "User already exists!"
            });
        }
         const user = await User.create({name, email, password});
        return response.status(201).json({
            token: auth(user._id),
            message: "User created successfuly!"
        });
    } catch(error) {
        response.status(500).json({ message: 'Server error' });
        console.log("Error while registering user!", error);
    }
}

// User login

const login = async (request, response) => {
    const {email, password} = request.body;
    try {
       const user = await User.findOne({email});
       if(!user) {
        return response.status(400).json({
            message: "Invalid email"
        });
       }
       const passwordMatch = bcrypt.compare(password, user.password);
       if(!passwordMatch) {
        return response.status(400).json({
            message: "Invalid password"
        });
       }
       return response.status(200).json({
        token: auth(user._id),
        message: "User logged in..."
       })

    } catch(error) {
        console.log("Error while logging in...", error);
        return response.status(500).json({
            message: "Something went wrong!"
        });
    }
}


module.exports = {
    register,
    login,
}