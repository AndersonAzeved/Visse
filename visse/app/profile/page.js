// app/profile/page.js
'use client'

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Profile() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/signin")
      return
    }

    setName(session.user.name || "")
    setEmail(session.user.email || "")
  }, [session, status, router])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (newPassword && newPassword !== confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          currentPassword: newPassword ? currentPassword : undefined,
          newPassword: newPassword || undefined,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess("Perfil atualizado com sucesso!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        
        // Atualiza a sessão
        await update()
      } else {
        setError(data.message || "Erro ao atualizar perfil")
      }
    } catch (error) {
      setError("Erro ao atualizar perfil")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletePassword) {
      setError("Digite sua senha para confirmar")
      return
    }

    setDeleteLoading(true)
    setError("")

    try {
      const res = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: deletePassword }),
      })

      const data = await res.json()

      if (res.ok) {
        alert("Conta deletada com sucesso!")
        signOut({ callbackUrl: "/" })
      } else {
        setError(data.message || "Erro ao deletar conta")
      }
    } catch (error) {
      setError("Erro ao deletar conta")
    } finally {
      setDeleteLoading(false)
      setShowDeleteModal(false)
      setDeletePassword("")
    }
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
        maxWidth: "600px",
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
          <h1>Editar Perfil</h1>
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

        {success && (
          <div style={{
            backgroundColor: "#d1fae5",
            color: "#065f46",
            padding: "0.75rem",
            borderRadius: "4px",
            marginBottom: "1rem"
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              Nome:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <hr style={{ margin: "2rem 0", border: "1px solid #e5e7eb" }} />

          <h3 style={{ marginBottom: "1rem", color: "#374151" }}>Alterar Senha (opcional)</h3>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Senha Atual:
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Nova Senha:
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Confirmar Nova Senha:
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#10b981",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
              marginRight: "1rem"
            }}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Deletar Conta
          </button>
        </form>

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "90%"
            }}>
              <h3 style={{ marginBottom: "1rem", color: "#dc2626" }}>
                Confirmar Exclusão
              </h3>
              <p style={{ marginBottom: "1rem", color: "#666" }}>
                Esta ação não pode ser desfeita. Digite sua senha para confirmar:
              </p>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Digite sua senha"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                  boxSizing: "border-box"
                }}
              />
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  style={{
                    backgroundColor: "#dc2626",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    border: "none",
                    cursor: deleteLoading ? "not-allowed" : "pointer",
                    opacity: deleteLoading ? 0.5 : 1
                  }}
                >
                  {deleteLoading ? "Deletando..." : "Confirmar"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeletePassword("")
                  }}
                  style={{
                    backgroundColor: "#6b7280",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}