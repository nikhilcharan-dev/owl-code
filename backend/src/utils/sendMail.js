
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const sendMail = async ({ to, subject, html }) => {
    try {
        const response = await axios.post(
            `${process.env.MAIL_URL}/send-mail`,
            {
                to,
                subject,
                html
            },
            {
                headers: {
                    "Authorization": `${process.env.MAIL_SECRET}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Email Service Error:', error.response?.data || error.message);
        // Don't crash the app if email fails, but log it
        return null;
    }
};
