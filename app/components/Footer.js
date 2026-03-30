import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <Link href="/terms">Terms of Service</Link>
      <Link href="/privacy">Privacy Policy</Link>
      <Link href="/dmca">DMCA</Link>
    </footer>
  );
}
