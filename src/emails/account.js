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

module.exports={
    sendwelcomeemail
}