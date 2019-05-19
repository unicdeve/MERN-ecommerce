const mailer = require('nodemailer');
const { welcome } = require("./welcome_template");
const { purchase } = require("./purchase_template");
require('dotenv').config();


const getEmailData = (to,name,token,template, transactionData) =>{
    let data = null;

    switch(template){
        case "welcome":
            data = {
                from: "taiwo ogunola <uniqueomokenny@gmail.com>",
                to,
                subject: `Welcome to waves ${name}`,
                html: welcome()
            }
        break;

        case "purchase":
            data = {
                from: "taiwo ogunola <uniqueomokenny@gmail.com>",
                to,
                subject: `Thanks for shopping with us, ${name}`,
                html: purchase(transactionData)
            }
        break;
        default:
            data;
    }
    return data;
}


const sendEmail = (to,name,token,type, transactionData=null) => {

    const smtpTransport = mailer.createTransport({
        service:"Gmail",
        auth:{
            user: "uniqueomokenny@gmail.com",
            pass: process.env.EMAIL_PASS
        }
    });

    const mail = getEmailData(to,name,token,type, transactionData)

    smtpTransport.sendMail(mail,function(error,response){
        if(error){
            console.log(error);
        } else {
            cb()
        }
        smtpTransport.close();
    })
}

module.exports = { sendEmail }