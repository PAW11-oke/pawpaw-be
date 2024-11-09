function verificationEmailTemplate(verificationUrl) {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; text-align: center;">
            <h1 style="color: #000; font-size: 24px; font-weight: bold;">Verify Your Email</h1>
            <p style="color: #666; margin: 20px 0; font-size: 16px;">
                Thank you for signing up! Please verify your email by clicking the button below:
            </p>
            <div style="margin: 30px 0;">
                <a href="${verificationUrl}" 
                    style="background-color: #FCA5A5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 18px; display: inline-block;">
                    Verify Email
                </a>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                If the button doesn't work, you can also copy and paste this link in your browser:
            </p>
            <p style="color: #666; font-size: 14px; word-break: break-all;">
                ${verificationUrl}
            </p>
        </div>
    `;
}

export default verificationEmailTemplate;
