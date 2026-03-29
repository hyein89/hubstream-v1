import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 20px', 
      background: '#fff', 
      borderBottom: '1px solid #ddd' 
    }}>
      {/* Logo menggunakan SVG Play */}
      <Link href="/" style={{ 
        textDecoration: 'none', 
        color: '#000', 
        fontWeight: 'bold', 
        fontSize: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px' 
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        VideoHosting
      </Link>

      {/* Menu Navigasi */}
      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link href="/terms" style={{ textDecoration: 'none', color: '#000', fontSize: '14px' }}>
          Terms
        </Link>
        <Link href="/contact" style={{ textDecoration: 'none', color: '#000', fontSize: '14px' }}>
          Contact
        </Link>
      </nav>
    </header>
  );
}
