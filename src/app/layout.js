import './globals.css';

export const metadata = {
    title: 'My Next.js App',
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
