const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true, 
        logger: true,
        debug: true,
        secureConnection: false,
        auth: {
            user: process.env.EMAIL_USERNAME, 
            pass: process.env.EMAIL_PASSWORD, 
        },
        tls: {
            rejectUnauthorized: true 
        }
    });
    
    await transporter.sendMail();
};

module.exports = sendEmail;
