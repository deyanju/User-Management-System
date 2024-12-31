
const nodemailer = require('nodemailer');

exports.sendEmailVerification = async (email, verificationLink) => {
    /*const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });*/

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use true for 465 (SSL), false for 587 (TLS)
        auth: {
          user: process.env.EMAIL_USER, // Your Gmail address
          pass: process.env.EMAIL_PASS,   // Use the App Password here
        },
      });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the following link: ${verificationLink}`
    };

    await transporter.sendMail(mailOptions);
};




