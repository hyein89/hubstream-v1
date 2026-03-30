'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState({ tampil: false, pesan: '', tipe: 'error' });
  const router = useRouter();

  const tampilkanNotif = (pesan) => {
    setNotif({ tampil: true, pesan, tipe: 'error' });
    setTimeout(() => setNotif({ tampil: false, pesan: '', tipe: 'error' }), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // Jika sukses, lempar ke halaman list/admin
        router.push('/list');
      } else {
        tampilkanNotif('Invalid Email or Password. Access Denied.');
      }
    } catch (err) {
      tampilkanNotif('Server error. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: '20px' }}>
      
      <style jsx global>{`
        .notif-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding: 15px 25px; background: #da3633; color: #fff; font-weight: bold; z-index: 9999; border: 1px solid #f85149; box-shadow: 0 10px 20px rgba(0,0,0,0.5); animation: slideDown 0.3s ease-out; }
        @keyframes slideDown { from { top: -50px; opacity: 0; } to { top: 20px; opacity: 1; } }
        input:focus { border-color: #58a6ff !important; outline: none; }
      `}</style>

      {notif.tampil && <div className="notif-toast">{notif.pesan}</div>}

      <div style={{ width: '100%', maxWidth: '400px', background: '#161b22', border: '1px solid #30363d', padding: '40px', boxShadow: '15px 15px 0 #000' }}>
        
        {/* SVG LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#238636" strokeWidth="2" strokeLinecap="square">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <h1 style={{ color: '#fff', fontSize: '24px', marginTop: '15px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Access</h1>
          <p style={{ color: '#8b949e', fontSize: '14px', marginTop: '5px' }}>Please sign in to manage your videos.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#c9d1d9', display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold' }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#0d1117', border: '1px solid #30363d', color: '#fff', fontSize: '15px' }}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ color: '#c9d1d9', display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold' }}>Security Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#0d1117', border: '1px solid #30363d', color: '#fff', fontSize: '15px' }}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '15px', background: '#238636', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', textTransform: 'uppercase', transition: '0.2s' }}
          >
            {loading ? 'Verifying Identity...' : 'Authorized Login'}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
           <a href="/" style={{ color: '#8b949e', fontSize: '12px', textDecoration: 'none' }}>&larr; Back to Homepage</a>
        </div>
      </div>
    </div>
  );
}
