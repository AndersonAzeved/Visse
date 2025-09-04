// app/layout.js
import { SessionProvider } from './components/SessionProvider'

export const metadata = {
  title: 'Visse!',
  description: 'Uma rede social nordestina',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}