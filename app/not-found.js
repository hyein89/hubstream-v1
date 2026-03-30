import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ 
      background: '#0d1117', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'system-ui, sans-serif', 
      color: '#fff',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ border: '1px solid #30363d', background: '#161b22', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '10px 10px 0 #000' }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 10px 0', color: '#da3633', borderBottom: '2px solid #30363d', paddingBottom: '10px' }}>
          404
        </h1>
        <h2 style={{ fontSize: '18px', margin: '0 0 25px 0', fontWeight: 'normal', color: '#8b949e' }}>
          Page or Video Not Found
        </h2>
        <Link href="/" style={{ 
          display: 'inline-block',
          background: '#238636', 
          color: '#fff', 
          padding: '12px 25px', 
          textDecoration: 'none', 
          fontWeight: 'bold', 
          border: 'none',
          textTransform: 'uppercase',
          fontSize: '14px'
        }}>
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
