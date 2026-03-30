import './globals.css';

export const metadata = {
  title: 'HubStream',
  description: 'Premium Video Streaming',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
