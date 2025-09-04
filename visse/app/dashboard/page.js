// app/dashboard/page.js
'use client'

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function Dashboard() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Ainda carregando

    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  if (status === "loading") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <p>Carregando...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem"
        }}>
          <h1>Dashboard</h1>
          <button
            onClick={handleSignOut}
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Sair
          </button>
        </div>

        <div style={{
          backgroundColor: "#f9fafb",
          padding: "1.5rem",
          borderRadius: "6px",
          marginBottom: "2rem"
        }}>
          <h2 style={{ marginBottom: "1rem" }}>Informações do Usuário</h2>
          
          {session.user.image && (
            <img
              src={session.user.image}
              alt="Avatar"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                marginBottom: "1rem"
              }}
            />
          )}
          
          <p><strong>Nome:</strong> {session.user.name || "Não informado"}</p>
          <p><strong>Email:</strong> {session.user.email}</p>
          <p><strong>ID:</strong> {session.user.id}</p>
        </div>

        <div>
          <h2 style={{ marginBottom: "1rem" }}>Bem-vindo ao seu Dashboard!</h2>
          <p style={{ marginBottom: "2rem" }}>
            Você está autenticado e pode acessar conteúdo protegido.
          </p>

          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <Link 
              href="/profile"
              style={{
                backgroundColor: "#f3f4f6",
                padding: "1.5rem",
                borderRadius: "8px",
                textDecoration: "none",
                color: "#374151",
                border: "1px solid #e5e7eb",
                textAlign: "center",
                transition: "all 0.2s"
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👤</div>
              <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>Editar Perfil</div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Altere seus dados pessoais e senha
              </div>
            </Link>

            <Link 
              href="/users"
              style={{
                backgroundColor: "#f3f4f6",
                padding: "1.5rem",
                borderRadius: "8px",
                textDecoration: "none",
                color: "#374151",
                border: "1px solid #e5e7eb",
                textAlign: "center",
                transition: "all 0.2s"
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔍</div>
              <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>Buscar Usuários</div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Encontre outros usuários por nome ou email
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}