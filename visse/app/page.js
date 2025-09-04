// app/page.js
'use client'

import { useSession } from "next-auth/react"
import Link from "next/link"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: "#f5f5f5" 
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "3rem",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        maxWidth: "500px"
      }}>
        <h1 style={{ marginBottom: "2rem", color: "#333" }}>
          Bem-vindo ao Projeto Next.js
        </h1>
        
        {session ? (
          <div>
            <p style={{ marginBottom: "2rem", color: "#666" }}>
              Olá, <strong>{session.user.name || session.user.email}</strong>!
            </p>
            <Link 
              href="/dashboard"
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "4px",
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Ir para Dashboard
            </Link>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: "2rem", color: "#666" }}>
              Sistema de autenticação com NextAuth
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <Link 
                href="/auth/signin"
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "4px",
                  textDecoration: "none"
                }}
              >
                Entrar
              </Link>
              <Link 
                href="/auth/signup"
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "4px",
                  textDecoration: "none"
                }}
              >
                Criar Conta
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}