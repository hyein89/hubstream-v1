import Link from 'next/link';

export default function Header({ sitename }) {
  return (
    <header>
      {/* sitename bakal narik otomatis dari database */}
      <Link href="/" className="logo">{sitename || 'SITENAME'}</Link>
      <div className="nav-links">
          {/* Sesuai HTML lo, ini kosong */}
      </div>
    </header>
  );
}
