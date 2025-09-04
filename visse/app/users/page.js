// app/users/page.js
'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Users() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setUsers([])
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()

      if (res.ok) {
        setUsers(data.users)
      } else {
        setError("Erro ao buscar usuários")
      }
    } catch (error) {
      setError("Erro ao buscar usuários")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300) // Debounce de 300ms

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
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

  if (!session) return null

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", backgroundColor: "#f5f5f5" }}>
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
          <h1>Buscar Usuários</h1>
          <Link 
            href="/dashboard"
            style={{
              color: "#3b82f6",
              textDecoration: "none"
            }}
          >
            ← Voltar ao Dashboard
          </Link>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Digite um nome ou email para buscar..."
            style={{
              width: "100%",
              padding: "1rem",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              boxSizing: "border-box",
              fontSize: "1rem"
            }}
          />
        </div>

        {error && (
          <div style={{
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            padding: "0.75rem",
            borderRadius: "4px",
            marginBottom: "1rem"
          }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            Buscando usuários...
          </div>
        )}

        {!loading && searchQuery && users.length === 0 && (
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            Nenhum usuário encontrado para "{searchQuery}"
          </div>
        )}

        {!loading && !searchQuery && (
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            Digite algo no campo de busca para encontrar usuários
          </div>
        )}

        {!loading && users.length > 0 && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#374151" }}>
              {users.length} usuário(s) encontrado(s):
            </h3>
            
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem"
                }}
              >
                {user.image && (
                  <img
                    src={user.image}
                    alt={`Avatar de ${user.name}`}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />
                )}
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, marginBottom: "0.25rem", color: "#111827" }}>
                    {user.name || "Nome não informado"}
                  </h4>
                  <p style={{ margin: 0, marginBottom: "0.25rem", color: "#6b7280" }}>
                    {user.email}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#9ca3af" }}>
                    Membro desde: {formatDate(user.createdAt)}
                  </p>
                </div>

                {session.user.email === user.email && (
                  <div style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: "bold"
                  }}>
                    Você
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}