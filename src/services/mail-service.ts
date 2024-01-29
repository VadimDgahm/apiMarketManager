import nodemailer from 'nodemailer'
const xxx = {
    port: 465,
    secure: true,
    host: "smtp.gmail.com",
    auth: {
        user: "meatemarketsup@gmail.com",
        password: "tdts ymbe zadj uggg"
    }
}
export const mailService = {
    transporter() {
        return nodemailer.createTransport(xxx)
    },
    async sendActivationMail(to: string, link: string) {
        const res =  this.transporter()

            await res.sendMail({
                from: 'Fred Foo 👻', // sender address
                to, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
            })


    }
}