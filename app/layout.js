export const metadata = {
  title: 'Video Player',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif', backgroundColor: '#f4f4f5' }}>
        {children}
      </body>
    </html>
  )
}
