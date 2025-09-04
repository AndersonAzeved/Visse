// app/page.js
import React from "react";
export default function ApiDocumentation() {
  return (
    <div style={{ 
      maxWidth: "800px", 
      margin: "2rem auto", 
      padding: "2rem",
      fontFamily: "monospace",
      lineHeight: "1.6"
    }}>
      <h1>🚀 NextAuth API - CRUD Users</h1>
      <p>Sistema de autenticação e CRUD de usuários usando NextAuth + Prisma + SQLite</p>
      
      <hr style={{ margin: "2rem 0" }} />
      
      <h2>📋 Endpoints Disponíveis:</h2>
      
      <div style={{ marginBottom: "2rem" }}>
        <h3>🔐 Autenticação</h3>
        <ul>
          <li><strong>POST</strong> <code>/api/auth/signup</code> - Registrar novo usuário</li>
          <li><strong>POST</strong> <code>/api/auth/signin</code> - Login (NextAuth)</li>
          <li><strong>GET</strong> <code>/api/auth/session</code> - Obter sessão atual</li>
          <li><strong>POST</strong> <code>/api/auth/signout</code> - Logout</li>
        </ul>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h3>👥 Usuários (CRUD)</h3>
        <ul>
          <li><strong>GET</strong> <code>/api/users/search?q=termo</code> - Buscar usuários</li>
          <li><strong>PUT</strong> <code>/api/users/update</code> - Atualizar perfil (autenticado)</li>
          <li><strong>DELETE</strong> <code>/api/users/delete</code> - Deletar conta (autenticado)</li>
        </ul>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <h2>🧪 Como Testar:</h2>
      
      <h3>1. Registrar Usuário:</h3>
      <pre style={{ 
        backgroundColor: "#f5f5f5", 
        padding: "1rem", 
        borderRadius: "4px",
        overflow: "auto"
      }}>
{`curl -X POST http://localhost:3000/api/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }'`}
      </pre>

      <h3>2. Login (Obter Token):</h3>
      <pre style={{ 
        backgroundColor: "#f5f5f5", 
        padding: "1rem", 
        borderRadius: "4px",
        overflow: "auto"
      }}>
{`curl -X POST http://localhost:3000/api/auth/callback/credentials \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "email=joao@email.com&password=123456"`}
      </pre>

      <h3>3. Buscar Usuários:</h3>
      <pre style={{ 
        backgroundColor: "#f5f5f5", 
        padding: "1rem", 
        borderRadius: "4px",
        overflow: "auto"
      }}>
{`curl -X GET "http://localhost:3000/api/users/search?q=joão"`}
      </pre>

      <h3>4. Atualizar Perfil:</h3>
      <pre style={{ 
        backgroundColor: "#f5f5f5", 
        padding: "1rem", 
        borderRadius: "4px",
        overflow: "auto"
      }}>
{`curl -X PUT http://localhost:3000/api/users/update \\
  -H "Content-Type: application/json" \\
  -H "Cookie: next-auth.session-token=SEU_TOKEN" \\
  -d '{
    "name": "João Silva Santos",
    "email": "joao.novo@email.com"
  }'`}
      </pre>

      <h3>5. Deletar Conta:</h3>
      <pre style={{ 
        backgroundColor: "#f5f5f5", 
        padding: "1rem", 
        borderRadius: "4px",
        overflow: "auto"
      }}>
{`curl -X DELETE http://localhost:3000/api/users/delete \\
  -H "Content-Type: application/json" \\
  -H "Cookie: next-auth.session-token=SEU_TOKEN" \\
  -d '{
    "password": "123456"
  }'`}
      </pre>

      <hr style={{ margin: "2rem 0" }} />

      <h2>⚡ Como Executar:</h2>
      <pre style={{ 
        backgroundColor: "#f0f9ff", 
        padding: "1rem", 
        borderRadius: "4px",
        border: "1px solid #0ea5e9"
      }}>
{`# 1. Instalar dependências
npm install

# 2. Configurar banco
npx prisma generate
npx prisma db push

# 3. Executar servidor
npm run dev

# 4. API disponível em:
http://localhost:3000`}
      </pre>

      <div style={{ 
        backgroundColor: "#fef3c7", 
        border: "1px solid #f59e0b",
        padding: "1rem", 
        borderRadius: "4px",
        marginTop: "2rem"
      }}>
        <strong>💡 Dica:</strong> Use ferramentas como Postman, Insomnia ou Thunder Client (VS Code) para testar as APIs de forma mais fácil!
      </div>
    </div>
  )
}