import './globals.css';
import { Inter, Roboto_Mono } from 'next/font/google';
import Script from 'next/script';

const sansFont = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const monoFont = Roboto_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
});

export const metadata = {
  title: 'Chatkit Conversation Hub',
  description: 'Coordinate Workflow SG agents and teammates in real time.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${sansFont.variable} ${monoFont.variable} antialiased`}>
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
