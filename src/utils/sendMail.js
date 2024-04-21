const nodeMailer = require('nodemailer')

const sendEmail = async (mailOptions) => {
    const transporter = nodeMailer.createTransport({
         host: "smpt.live.com",
         port: 587,
         secure: true,
         auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
         }
    })
    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log("Hata çıktı Mail Gönderilemedi : ", error);
        } 
        console.log("info:", info)
        return true
    })
}

module.exports = sendEmail