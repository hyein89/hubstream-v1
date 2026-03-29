import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ 
      padding: '20px', 
      background: '#fff', 
      borderTop: '1px solid #ddd', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    }}>
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link href="/terms" style={{ textDecoration: 'none', color: '#666', fontSize: '12px' }}>Terms of Service</Link>
        <Link href="/contact" style={{ textDecoration: 'none', color: '#666', fontSize: '12px' }}>Contact Us</Link>
      </div>
      <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>
        &copy; {new Date().getFullYear()} VideoHosting. All rights reserved.
      </p>
    </footer>
  );
}
