//create a transport for sending email
//create a message
//send email
const nodemailer=require('nodemailer');
async function sendTestEmail(email,username){
    try {
        let transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.email,
                pass:process.env.password
            }
        });
        const message={
            from:process.env.email,
            to:email,
            subject:"Account Registration Successful",
            text:`Thank you, ${username}, for registering with our service!`
        };
        const info = await transporter.sendMail(message);
        console.log("Email sent successfully:",info.response);
        return info;
    } catch(error) {
        console.error("Error sending email:",error);
        throw error;
    }
}
module.exports={sendTestEmail};