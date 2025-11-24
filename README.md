# Visse: *Uma rede social nordestina!*

# Guia de Testes

## Endpoints Disponíveis

### Autenticação
- **POST** `/api/auth/signup` - Registrar usuário
- **GET** `/api/auth/session` - Obter sessão atual
- **POST** `/api/auth/callback/credentials` - Login
- **POST** `/api/auth/signout` - Logout

### Usuários (CRUD)
- **GET** `/api/users/search?q=termo` - Buscar usuários
- **PUT** `/api/users/update` - Atualizar perfil (requer auth)
- **DELETE** `/api/users/delete` - Deletar conta (requer auth)

---

## Testes com cURL

### 1. Registrar Usuário
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }'
```

**Resposta Esperada:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "id": "cm1234...",
    "name": "João Silva",
    "email": "joao@email.com",
    "createdAt": "2025-01-01T10:00:00.000Z"
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=joao@email.com&password=123456" \
  -c cookies.txt
```

### 3. Verificar Sessão
```bash
curl -X GET http://localhost:3000/api/auth/session \
  -b cookies.txt
```

### 4. Buscar Usuários
```bash
curl -X GET "http://localhost:3000/api/users/search?q=joão"
```

**Resposta Esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cm1234...",
      "name": "João Silva",
      "email": "joao@email.com",
      "image": null,
      "createdAt": "2025-01-01T10:00:00.000Z"
    }
  ],
  "total": 1,
  "query": "joão"
}
```

### 5. Atualizar Perfil
```bash
curl -X PUT http://localhost:3000/api/users/update \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "João Silva Santos",
    "email": "joao.novo@email.com"
  }'
```

### 6. Alterar Senha
```bash
curl -X PUT http://localhost:3000/api/users/update \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "João Silva Santos",
    "email": "joao.novo@email.com",
    "currentPassword": "123456",
    "newPassword": "novaSenha123"
  }'
```

### 7. Deletar Conta
```bash
curl -X DELETE http://localhost:3000/api/users/delete \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "password": "123456"
  }'
```

---

## Configuração do Ambiente

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados
```bash
npx prisma generate
npx prisma db push
```

### 3. Variáveis de Ambiente (.env.local)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta_muito_segura_aqui
DATABASE_URL="file:./dev.db"
```

### 4. Executar Servidor
```bash
npm run dev
```

---

## Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | ✅ Sucesso |
| 201 | ✅ Criado |
| 400 | ❌ Dados inválidos |
| 401 | ❌ Não autenticado |
| 404 | ❌ Não encontrado |
| 500 | ❌ Erro interno |

---

## Padrão de Resposta da API

### Sucesso
```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { /* dados da resposta */ }
}
```

### Erro
```json
{
  "success": false,
  "message": "Descrição do erro"
}
```

---

## Ferramentas Recomendadas

- **Postman** - GUI para testes de API
- **Insomnia** - Alternativa ao Postman
- **Thunder Client** - Extensão para VS Code
- **cURL** - Linha de comando
- **Prisma Studio** - Interface para visualizar o banco

### Executar Prisma Studio
```bash
npm run db:studio
```
Acesse: http://localhost:5555

---

## Fluxo de Teste Completo

1. **Registrar usuário** → `POST /api/auth/signup`
2. **Fazer login** → `POST /api/auth/callback/credentials`
3. **Verificar sessão** → `GET /api/auth/session`
4. **Buscar usuários** → `GET /api/users/search?q=termo`
5. **Atualizar perfil** → `PUT /api/users/update`
6. **Deletar conta** → `DELETE /api/users/delete`


---

## Documentação de Qualidade e Testes

Para garantir a robustez e confiabilidade do sistema Visse, foram aplicadas estratégias avançadas de testes e análise de código. Consulte a documentação detalhada abaixo:

### Plano de Testes e Cobertura
Detalhamento da estratégia de TDD utilizada, ferramentas (Jest) e os resultados finais de cobertura alcançados .
* **[Acessar Plano de Testes](/visse/docs/tarefas/tarefa_03/plano_de_testes.md)**

### Testes de Mutação
Relatório sobre a eficácia dos testes unitários utilizando **StrykerJS**. Explica como os testes se comportaram diante de mutações no código.
* **[Entender Testes de Mutação](/visse/docs/tarefas/tarefa_03/testes_mutacao.md)**

### Manual de Execução
Um guia passo a passo simplificado para quem deseja clonar o repositório, instalar as dependências e rodar todos os comandos do projeto.
* **[Ver Manual de Execução](/visse/docs/tarefas/tarefa_03/MANUAL_DE_EXECUCAO.md)**

---