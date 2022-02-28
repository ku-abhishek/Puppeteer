const nodemailer = require("nodemailer");

const trans=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"",
        pass:''
    }
    
});
const sendMail = async (to, subject, description, attachments) => new Promise((resolve, reject) => {
    let mailoption={
        from:"",
        to,
        subject,
        text: description,
        attachments
    };
    trans.sendMail(mailoption,function(error,info){
        if (error){
            console.log(error); 
            reject('failed for :' + to);
        }
        else{
            console.log("email sent " + info.response);
            resolve();
        }
    });
});

module.exports = { sendMail };