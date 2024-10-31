import crypto from 'crypto';
import verificationEmailTemplate from './templateEmail';
import sendEmail from './sendEmail';

export async function emailVerify(user, request, type) {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    user.verificationToken = hashedToken;
    user.verificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    const url = new URL(request.url);
    const baseUrl = 'http://localhost:3000';

    const verificationUrl = `${baseUrl}/verifyEmail/${verificationToken}`;
    const message = verificationEmailTemplate(verificationUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: 'Verify Your Email',
            message,  
        });
    } catch (error) {
        console.error("Failed to send email:", error);
        user.VerificationToken = undefined;
        user.VerificationExpires = undefined;
        await user.save({ validateBeforeSave: false });
        throw new Error('Failed to send verification email');
    }
}