# Consolida IAG — Front-end Web: Guidelines & Specifications

Bem-vindo ao repositório **Front-end** do **Consolida IAG**. Este documento estabelece as diretrizes de experiência do usuário, fluxos operacionais e consumo de APIs para o cliente web da instituição.

---

## 📌 Visão Geral do Repositório (Front-end)

O **Consolida IAG (Front-end)** é uma aplicação **Web Responsiva** focada em dois públicos essenciais do Instituto Anchieta Grajaú:

1. **Solicitantes nos Serviços (Cozinhas):** Interface mobile ultrassimples para seleção semanal rápida de insumos por Serviço (`CEI`, `CCA`, `CJ`).
2. **Comprador / Gestor:** Painel desktop para acompanhamento do ciclo, encerramento de pedidos, visualização consolidada para cotação em atacado e visualização individual com exportação em PDF para prestação de contas.

---

## 📜 Regras do Agente (Workspace Rules)

As especificações do front-end estão organizadas no diretório `.agents/rules/`:

1. **Domínio e Regras de Negócio:** @.agents/rules/business-domain.md
   - Entidades (`Serviço`, `Produto`, `CicloSemanal`).
   - Regras RN-01 a RN-04.
   - Isolamento por Serviço e não-destrutividade de dados.

2. **Fronteiras e Fora de Escopo:** @.agents/rules/technical-boundaries.md
   - Restrições contra estoque diário, emissão de NF-e, gateways de pagamento.
   - **Sem App Nativo:** Solução estritamente Web Responsiva.

3. **Interface e Fluxos Operacionais (UI/UX):** @.agents/rules/ui-ux-flow.md
   - **Mobile Solicitante:** Botões `+` e `-` (alvos de toque >= 44px), sem digitação de nomes, preenchimento < 2 min.
   - **Desktop Comprador:** Abas Consolidada e por Serviço, exportação PDF e layout para impressão.
