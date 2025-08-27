const verifyEmailTemplate = ({name,url})=>{
    return`
<p>Dear ${name}</p>    
<p>Thank you for registering  with RealMillet. To complete your registration, please verify your email address by clicking the button below.</p>
<p>If you did not create an account, no further action is required.</p>
<p>Best regards,</p>
<p>The Team at -RealMillet.</p>   
<a href=${url} style="color:black;background :orange;margin-top : 10px,padding:20px,display:block">
    Verify Email
</a>
`
}

export default verifyEmailTemplate