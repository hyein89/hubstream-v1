import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      {/* Konten Utama Beranda */}
      <main style={{ flex: 1, padding: '20px', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <h1 style={{ margin: '0 0 20px 0', fontSize: '24px' }}>Video Terbaru</h1>
        {/* Nanti daftar grid video bisa ditaruh di sini */}
        <div style={{ padding: '40px', background: '#fff', border: '1px solid #ddd', textAlign: 'center' }}>
          <p>Belum ada video.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
