const sgmail=require('@sendgrid/mail')

sgmail.setApiKey(process.env.SENDGRID_API_KEY)

const sendwelcomeemail=(email,firstname)=>{
    sgmail.send({
        to:email,
        from:"koladiyadhruvi532@gmail.com",
        subject:"Thanks for joining in!",
        text:`Welcome to the app, ${firstname}. Let me know how you get along with the app.`
    })
}

const sendresetpasswordemail=(email,num)=>{
    sgmail.send({
        to:email,
        from:"koladiyadhruvi532@gmail.com",
        subject:"Reset password link!",
        text:`Otp for reset your password is ${num}.`
    })
}

const sendcancelemail=(email,name)=>{
    sgmail.send({
        to:email,
        from:'koladiyadhruvi532@gmail.com',
        subject:'Sorry to see you go!',
        text:`Goodbye, ${name}. I hope to see you back sometime soon.`
    })
}

module.exports={
    sendwelcomeemail,
    sendresetpasswordemail,
    sendcancelemail
}