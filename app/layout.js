export const metadata = {
  title: 'Video Player',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
       {children}
      </body>
    </html>
  )
}
