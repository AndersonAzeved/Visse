# T02 - Tarefa 02 - Uso de TDD e Análise Estática - Relatório Final

## 1. Cobertura de Testes e TDD 

A aplicação das técnicas de TDD (Test-Driven Development) e a ampliação da cobertura foram concluídas com sucesso. O foco foi na criação de testes de **integração de rota (E2E Mocks)** para cobrir todas as validações, caminhos de exceção e a lógica de banco de dados (`Prisma`) nas APIs.

### Cobertura 1
![Cobertura 1](/visse/docs/tarefas/tarefa_02/coverage_v1.png)

### Cobertura 2
![Cobertura 2](/visse/docs/tarefas/tarefa_02/coverage_v2.jpeg)

### Rotas Testados

`auth/signup/route.js`, 
`users/delete/route.js`, 
`users/search/route.js`,  
`users/update/route.js`,  
`auth/[...nextauth]/route.js` 


---

## 2. Análise Estática e Qualidade 

A análise estática do projeto foi configurada no SonarCloud.

### Resultados da Análise (Visse NextAuth API)
![Sonar](/visse/docs/tarefas/tarefa_02/sonar.png)


---

## 3. Pesquisa sobre Testes com Selenium

O **Selenium** é a ferramenta de automação de navegadores ideal para realizar **Testes End-to-End (E2E)**, que complementam os testes de unidade de rota que desenvolvemos.

| Tópico | Detalhes |
| :--- | :--- |
| **Função** | Simular a interação real do usuário no frontend para garantir que a aplicação funcione corretamente em diferentes navegadores. |
| **Valor para o Visse** | Seria usado para testar fluxos de Login/Logout e a atualização de dados do perfil a partir da interface do usuário (testando a integração completa da UI com a API). |
| **Alternativas** | Para projetos Next.js e JavaScript, ferramentas como **Playwright** e **Cypress** são alternativas mais modernas, rápidas e com melhor integração para testes E2E. |