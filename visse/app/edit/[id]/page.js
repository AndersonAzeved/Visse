"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditUserPage() {
  const params = useParams(); // pega o id da URL
  const id = params.id;

  const [user, setUser] = useState({ name: "", email: "" });
  const router = useRouter();

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((u) => u.id.toString() === id); // converte para string
        if (found) setUser(found);
      })
      .catch((err) => console.error("Erro ao buscar usuário:", err));
  }, [id]);


  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user, id }),
    });
    router.push("/"); // volta para a lista após atualizar
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Editar Usuário</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
