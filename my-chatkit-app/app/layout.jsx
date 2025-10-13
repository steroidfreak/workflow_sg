import './globals.css';

export const metadata = {
  title: 'Chatkit Conversation Hub',
  description: 'Coordinate Workflow SG agents and teammates in real time.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
