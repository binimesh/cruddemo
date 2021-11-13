require('dotenv').config();

const nodemailer = require('nodemailer');
const hbs = require('nodemailer-handlebars');
const log = console.log;

let transporter = nodemailer.createTransport({
    service: process.env.SMPT_HOST,
    auth: {
        user: process.env.EMAIL, // TODO: your gmail account 
        pass: process.env.PASSWORD, // TODO: your gmail password
    }
});

transporter.use('compile', hbs({
    viewEngine: 'express-handlebars',
    viewPath: './views/'
}));


let mailOptions = {
    from: process.env.SMPT_HOST, // TODO: email sender
    to: Option.email, // TODO: email receiver
    subject: 'welcom to app',
    text: 'Wooohooo it works!!',
    template: 'index',
    attachments: [
        { filename: 'valcano.JPG',path:'./picture/valcano.JPG'}
    ],
    context: {
        name: 'Accime Esterling'
    } // send extra values to template
};

transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
        return log('Error occurs');
    }
    return log('Email sent!!!');
});
module.export = {mailoption};