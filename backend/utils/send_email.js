const nodemailer = require('nodemailer');
require('dotenv').config();

// Function to handle email submissions

const sendEmails = async (options, request, response) => {
    try {
        console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS,
            }
        });
        const mailOptions = {
            from: 'Task manager <no-reply>',
            to: options.email,
            subject: options.subject,
            text: options.message,
        }

        await transporter.sendMail(mailOptions);

    } catch(error) {
        console.log("Error", error);
        throw error;
    }
}

module.exports = sendEmails;