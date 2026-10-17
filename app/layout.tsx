import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Can I Eat That? — Gluten-free, less guesswork', icons: { icon: '/can-i-eat-that-mark.svg' }, description: 'Scan a barcode, explore gluten-free food and check recorded UK prices. Real product data, clear evidence, no AI guesses.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en-GB"><body>{children}</body></html> }
