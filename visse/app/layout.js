// app/layout.js
import React from "react";

export const metadata = {
  title: 'VISSE!',
  description: 'Rede social nordestina',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  )
}