# Manual de Execução - Projeto Visse

Bem-vindo ao manual de execução do **Visse**, uma API de autenticação e gerenciamento de usuários construída com **Next.js**, **NextAuth** e **Prisma**.

Este documento guia você desde a configuração do ambiente até a execução dos pipelines de qualidade (Testes e SonarQube).

---

## Pré-requisitos

Certifique-se de ter o ambiente configurado com as seguintes ferramentas:

| Ferramenta | Versão Mínima | Link para Download |
| :--- | :--- | :--- |
| **Node.js** | `v18.17.0` ou superior | [Baixar Node.js](https://nodejs.org/) |
| **NPM** | `v9.0.0` ou superior | Incluído no Node.js |
| **Git** | `v2.0.0` ou superior | [Baixar Git](https://git-scm.com/) |
| **Java (JRE)** | `v17` (Opcional*) | Necessário apenas para rodar o SonarScanner localmente. |

---

## 1. Instalação e Configuração

### 1.1. Clonar o Repositório
Abra seu terminal e clone o projeto:

```bash
git clone [https://github.com/andersonazeved/Visse.git](https://github.com/andersonazeved/Visse.git)
cd Visse/visse
```

### 1.2. Instalar Dependências
Instale as bibliotecas do projeto

```bash
npm install
```

### 1.4. Configurar Banco de Dados (Prisma)
Inicialize o banco de dados SQLite e gere o cliente do Prisma

```bash
# Gera os tipos do Prisma Client (necessário após npm install)
npx prisma generate

# Cria o arquivo do banco de dados (dev.db) e aplica o schema
npx prisma db push
```

## 2. Executando a Aplicação
Para iniciar o servidor de desenvolvimento

```bash
npm run dev
```
* O terminal mostrará: > Ready on ```http://localhost:3000```
* Abra o navegador e acesse para testar.

## 3. Executando Testes e Qualidade
O projeto segue rigorosos padrões de qualidade. Utilize os comandos abaixo para validar o código.

### 3.1. Testes Unitários e Cobertura (Jest)
Executa a suíte de testes e gera o relatório de cobertura LCOV.

```bash
npm run coverage
```
* Meta: A cobertura deve ser superior a 70%.
* Relatório Visual: Abra o arquivo ```coverage/lcov-report/index.html``` no seu navegador para ver linha por linha o que foi testado.

### 3.2. Testes de Mutação (StrykerJS)
Verifica a eficácia dos testes inserindo "bugs artificiais" (mutantes).

```bash
npm run mutation
```
* Relatório Visual: Abra ```reports/mutation/html/index.html``` para ver quais mutantes sobreviveram.

### 3.3. Análise Estática (SonarQube)
Executa o scanner para verificar segurança, bugs e code smells.

Requisito: Você precisa de um token do SonarCloud ou de uma instância local rodando.

```bash
# Substitua SEU_TOKEN pelo token gerado no SonarCloud/SonarQube
npm run sonar -- -Dsonar.token=SEU_TOKEN
```

## 4. Integração Contínua (CI/CD)
Este projeto possui um workflow do **GitHub Actions** configurado em ```.github/workflows/ci.yml```.

O que ele faz automaticamente a cada Push:
1. Instala dependências.
2. Gera o Prisma Client.
3. Executa ```npm run coverage```.
4. Envia os resultados para o SonarCloud.

Para que funcione no seu fork/repositório:
1. Vá em **Settings > Secrets and variables > Actions**.
2. Adicione a secret ```SONAR_TOKEN``` com seu token do SonarCloud.