function verificationEmailTemplate(verificationUrl) {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Verify Your Email</h1>
            <p style="color: #666; margin: 20px 0;">Thank you for signing up! Please verify your email by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                    style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Verify Email
                </a>
            </div>
            <p style="color: #666; font-size: 14px;">If the button doesn't work, you can also copy and paste this link in your browser:</p>
            <p style="color: #666; font-size: 14px; word-break: break-all;">${verificationUrl}</p>
        </div>
    `;
}

export default verificationEmailTemplate;