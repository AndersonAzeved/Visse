"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [search, setSearch] = useState("");
  const router = useRouter();

  // busca os usuários
  const fetchUsers = () => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // adicionar usuário
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newUser = await res.json();
    setUsers([...users, newUser]); // atualiza lista
    setForm({ name: "", email: "" });
  };

  // deletar usuário
  const handleDelete = async (id) => {
    await fetch(`/api/users?userId=${id}`, { method: "DELETE" });
    setUsers(users.filter((u) => u.id !== id));
  };

  // filtrar usuários pelo search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>CRUD de Usuários</h1>

      {/* Pesquisa */}
      <input
        type="text"
        placeholder="Pesquisar usuário..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "20px", width: "100%", padding: "5px" }}
      />

      {/* Formulário */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button type="submit">Adicionar</button>
      </form>

      {/* Lista */}
      <ul>
        {filteredUsers.map((u) => (
          <li key={u.id}>
            {u.name} - {u.email}
            <button onClick={() => router.push(`/edit/${u.id}`)}>Editar</button>
            <button onClick={() => handleDelete(u.id)}>Deletar</button>
          </li>
        ))}
      </ul>

      {filteredUsers.length === 0 && <p>Nenhum usuário encontrado.</p>}
    </div>
  );
}
