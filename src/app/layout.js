import './globals.css';

export const metadata = {
    title: 'PawPaw Pet Care',
    description: 'A simple Next.js app with MongoDB',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
            {children}
        </body>
        </html>
    );
}
