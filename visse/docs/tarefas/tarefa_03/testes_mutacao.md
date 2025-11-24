# Relatório de Testes de Mutação

Este documento detalha a aplicação de **Testes de Mutação** no projeto Visse, utilizados para avaliar a eficácia e a robustez da suíte de testes automatizados.

---

## 1. O que são Testes de Mutação?

Testes de mutação (Mutation Testing) são uma técnica avançada de teste de software onde "defeitos" artificiais (chamados de **mutantes**) são inseridos deliberadamente no código-fonte. O objetivo é verificar se os testes existentes são capazes de detectar essas mudanças.

* **Mutante Morto (Killed):** O teste falhou após a alteração do código. Isso é **bom**, pois indica que o teste cobria aquela lógica.
* **Mutante Sobrevivente (Survived):** O teste continuou passando mesmo com o código alterado. Isso é **ruim**, indicando que o teste pode ser fraco ou incompleto.

## 2. Ferramenta Utilizada: StrykerJS

Para este projeto, utilizamos o [StrykerJS](https://stryker-mutator.io/), a ferramenta líder para testes de mutação em JavaScript/Node.js.


