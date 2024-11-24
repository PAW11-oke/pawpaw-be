import crypto from 'crypto';
import verificationEmailTemplate from './templateEmail';
import sendEmail from './nodemailerConfig';

export async function emailVerify(user, request, type) {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    user.verificationToken = hashedToken;
    user.verificationExpires = Date.now() + 60 * 60 * 1000; // 60 minutes
    await user.save({ validateBeforeSave: false });

    const url = new URL(request.url);
    const baseUrl = process.env.NEXTAUTH_URL;

    const verificationUrl = `${baseUrl}/verifyEmail/${verificationToken}`;
    const message = verificationEmailTemplate(verificationUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: 'PawPaw Verify Email ',
            message,  
        });
    } catch (error) {
        console.error("Failed to send email:", error);
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        await user.save({ validateBeforeSave: false });
        throw new Error('Failed to send verification email');
    }
}