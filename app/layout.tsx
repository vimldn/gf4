import type { Metadata } from 'next';
import './globals.css';
import './food-issue.css';
export const metadata: Metadata = { metadataBase: new URL('https://www.canieatthat.co.uk'), title: 'Can I Eat That? — Gluten-free, less guesswork', icons: { icon: '/can-i-eat-that-mark.svg' }, description: 'Scan a barcode, explore gluten-free food and check recorded UK prices. Real product data, clear evidence, no AI guesses.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en-GB"><body>{children}</body></html> }
