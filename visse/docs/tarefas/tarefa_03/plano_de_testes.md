# Plano de Testes de Software - Projeto Visse

## 1. Introdução
Este documento define o plano de testes para o projeto **Visse**, detalhando o escopo, a estratégia, as ferramentas e os critérios de aceitação necessários para garantir a qualidade das APIs de autenticação e gerenciamento de usuários.

## 2. Objetivos dos Testes
O objetivo principal é validar a integridade funcional, a segurança e a robustez do backend da aplicação, garantindo que:
* As regras de negócio de cadastro e login funcionem conforme esperado.
* O gerenciamento de usuários (CRUD) seja seguro e consistente.
* O código mantenha um alto padrão de manutenibilidade e segurança.

## 3. Escopo dos Testes

### 3.1. Itens a Serem Testados
O foco dos testes será a camada de API do Next.js (`app/api/`), especificamente:

| Módulo | Funcionalidade | Tipo de Teste | Prioridade |
| :--- | :--- | :--- | :--- |
| **Autenticação** | Registro de Usuário (`/api/auth/signup`) | Unidade/Integração | Alta |
| **Autenticação** | Login e Sessão (`/api/auth/[...nextauth]`) | Unidade/Integração | Alta |
| **Usuários** | Atualização de Perfil (`/api/users/update`) | Unidade/Integração | Média |
| **Usuários** | Exclusão de Conta (`/api/users/delete`) | Unidade/Integração | Alta |
| **Usuários** | Busca de Usuários (`/api/users/search`) | Unidade/Integração | Baixa |


## 4. Estratégia de Testes

### 4.1. Metodologia
Será utilizada a metodologia **TDD (Test-Driven Development)**. Os testes devem ser escritos antes da implementação ou correção de funcionalidades, focando primeiro nos cenários de falha (exceções) e depois nos cenários de sucesso.

### 4.2. Níveis de Teste
1.  **Testes de Unidade de Rota (Route Handlers):**
    * Isolamento da lógica da API utilizando **Mocks** para o banco de dados (`PrismaClient`) e serviços externos.
    * Validação de códigos de status HTTP (`200`, `201`, `400`, `401`, `500`).
    * Validação de mensagens de erro e corpos de resposta JSON.

2.  **Análise Estática:**
    * Verificação automática de *Code Smells*, Bugs e Vulnerabilidades em todo *push*.

3.  **Testes de Mutação:**
    * Verificação da eficácia dos testes através da inserção de falhas artificiais no código.

## 5. Critérios de Aceitação (Metas)

Para que uma funcionalidade ou versão seja considerada aprovada, ela deve atingir as seguintes métricas:

* **Execução:** 100% dos testes automatizados devem passar sem falhas.
* **Cobertura de Código:** Mínimo de **70%** de cobertura global (Statements/Lines).
* **Qualidade de Código (Sonar):** Quality Gate com status **Passed** (Rating A em Segurança e Confiabilidade).
* **Robustez:** O código deve resistir a uma análise de mutação com score satisfatório (indicando que os testes não são frágeis).

## 6. Ferramentas e Ambiente

| Ferramenta | Versão | Uso |
| :--- | :--- | :--- |
| **Jest** | v29+ | Framework de execução de testes e asserções. |
| **Prisma Mock** | - | Simulação das operações de banco de dados em memória. |
| **StrykerJS** | v8+ | Ferramenta para testes de mutação. |
| **SonarCloud** | SaaS | Plataforma de análise estática de código contínua. |
| **GitHub Actions** | - | Pipeline de CI/CD para execução automática. |

## 7. Procedimentos de Execução

### 7.1. Ciclo de Desenvolvimento
1.  Criar teste falhando para a nova funcionalidade.
2.  Implementar código para passar no teste.
3.  Executar `npm run coverage` para verificar cobertura.
4.  Submeter código (Push/PR).

### 7.2. Integração Contínua (CI)
O pipeline do GitHub Actions será acionado a cada *Pull Request* para:
1.  Instalar dependências.
2.  Executar testes unitários (`npm run coverage`).
3.  Executar o Scanner do SonarCloud.
4.  Bloquear o merge caso os critérios de aceitação não sejam atingidos.
