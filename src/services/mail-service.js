const nodemailer = require('nodemailer')

class MailService {

    constructor () {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "meats2024@gmail.com",
                pass: "vsgm tiet ibtj xyxe",
            }
        })
    }

    async sendActivationMail(to, link) {

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на' + process.env.API_URL,
            text: '',
            html:
                `
                   <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }
}

module.exports = new MailService()
