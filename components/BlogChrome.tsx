import Link from 'next/link';
import { ArrowUpRight, ChevronRight, Search } from 'lucide-react';

export function BlogHeader() {
  return (
    <>
      <a className="skip-link" href="#blog-main">Skip to blog</a>
      <header className="magazine-header">
        <Link className="magazine-masthead" href="/" aria-label="Can I Eat That? home">
          Can I Eat <span>That?</span>
        </Link>
        <div className="editorial-nav">
          <nav aria-label="Main navigation">
            <Link href="/#food-edits">Explore food <ChevronRight size={14}/></Link>
            <Link href="/#my-shelf">My shelf</Link>
            <Link href="/#our-story">Our story</Link>
            <Link href="/blog" className="active" aria-current="page">Blog</Link>
          </nav>
          <Link className="nav-search" href="/#food-search" aria-label="Go to food search"><Search size={20}/></Link>
        </div>
      </header>
    </>
  );
}

export function BlogFooter() {
  return (
    <footer className="magazine-footer blog-footer">
      <Link href="/" className="footer-wordmark">Can I Eat That?</Link>
      <p>A little more joy in gluten-free life.</p>
      <nav aria-label="Footer navigation">
        <Link href="/#food-search">Find food <ArrowUpRight size={13}/></Link>
        <Link href="/blog">Ari’s blog <ArrowUpRight size={13}/></Link>
        <Link href="/#our-story">Our story <ArrowUpRight size={13}/></Link>
      </nav>
      <small>Inspired by Ari. Made for gluten-free life. Always check current product labels and restaurant allergen information.</small>
    </footer>
  );
}
