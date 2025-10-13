import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Chatkit Conversation Hub',
  description: 'Coordinate Workflow SG agents and teammates in real time.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="afterInteractive"
        />
        <Script id="chatkit-usecaselauncher-redirect" strategy="afterInteractive">
          {`
            (function () {
              if (window.__chatkitLauncherRedirectBound) return;
              window.__chatkitLauncherRedirectBound = true;

              function handleLauncherClick(event) {
                var target = event.target;
                if (!(target instanceof Element)) {
                  return;
                }

                var launcher = target.closest('[data-usecaselauncher], [data-testid="use-case-launcher"], #usecaselauncher');
                if (!launcher) {
                  return;
                }

                event.preventDefault();
                if (launcher.dataset && typeof launcher.dataset.launchHref === 'string' && launcher.dataset.launchHref) {
                  window.location.assign(launcher.dataset.launchHref);
                  return;
                }

                var explicitHref = launcher.getAttribute('href');
                if (explicitHref) {
                  window.location.assign(explicitHref);
                  return;
                }

                window.location.assign('/usecaselauncher');
              }

              document.addEventListener('click', handleLauncherClick, true);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
