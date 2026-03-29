import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      backgroundColor: '#f4f4f5',
      textAlign: 'center',
      padding: '20px'
    }}>
      {/* Ikon SVG Alert/Error */}
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" style={{ marginBottom: '20px' }}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      
      <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>404 - Tidak Ditemukan</h1>
      <p style={{ margin: '0 0 20px 0', color: '#666' }}>Maaf, video atau halaman yang kamu cari tidak ada di server.</p>
      
      <Link href="/" style={{
        padding: '12px 24px', 
        background: '#000', 
        color: '#fff', 
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        border: 'none' // Sengaja gak dipakein border-radius
      }}>
        {/* Ikon SVG Arrow Left */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Kembali ke Beranda
      </Link>
    </div>
  );
}
