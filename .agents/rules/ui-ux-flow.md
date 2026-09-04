---
trigger: always_on
description: "UI/UX specifications, operational user flows (Mobile and Desktop), and interaction design constraints for Consolida IAG Front-end."
---

# Consolida IAG — Front-end UI/UX Specifications & Operational Flows

## Purpose

This rule defines the user experience (UX), interface requirements, and operational workflows for the **Consolida IAG Front-end**.

Any component implementation, styling, responsive layout, or user journey created by the Agent **MUST** follow these usability constraints to ensure rapid adoption by non-technical kitchen staff and seamless operation by management.

---

## 1. User Profiles & Operational Reality

| Perfil de Usuário | Contexto e Restrições | Diretriz de Design Principal |
| :--- | :--- | :--- |
| **Operador do Serviço (Cozinha)** | Tempo escasso (< 2 min), ambiente dinâmico, pouca familiaridade com sistemas complexos. Alto risco de abandono se houver burocracia. | **Interface Ultrassimples:** Lista visual, botões grandes de `+` / `-`, zero digitação de nomes de insumos. |
| **Comprador / Gestor** | Trabalho em desktop, necessidade de negociar por volume no atacado e prestar contas por Centro de Custo. | **Painel com 2 Abas:** Visão Consolidada para cotação e Visão Individual por Serviço com exportação em PDF/impressão para NF. |

---

## 2. Pilar 1: Fluxo do Solicitante (Web Mobile)

A interface dos serviços opera em ambiente web responsivo mobile-first acessada diretamente por link ou identificador do serviço (ex: `/pedido/cei`, `/pedido/cca`, `/pedido/cj`):

### 2.1 Requisitos de Interação

1. **Identificação Clara do Serviço:** A tela deve exibir em destaque o Serviço ativo (`CEI`, `CCA` ou `CJ`).
2. **Catálogo Pré-carregado com Unidade de Medida:**
   * Exibição em lista dos insumos ativos recorrentes da instituição (ex: *Arroz Agulhinha Tipo 1 (kg)*, *Feijão Carioca (kg)*, *Óleo de Soja (litro)*).
   * O operador não precisa selecionar unidade de medida; ela vem pré-fixada no item.
3. **Controles de Quantidade Numérica:**
   * Botões grandes e destacados de incremento (`+`) e decremento (`-`).
   * Alvos de toque com área mínima de 44x44px para facilitar o toque no ambiente operacional da cozinha.
   * Zero digitação manual obrigatória de nomes ou códigos de produtos.
4. **Campo de Observação Livre (RN-02.3):**
   * Localizado ao final da lista para registrar itens pontuais, emergências ou produtos fora do catálogo institucional.
5. **Ação de Conclusão Única:**
   * Botão de ação principal fixo ou em destaque: *"Finalizar Pedido da Semana"*.
   * Feedback visual imediato de sucesso após envio.
6. **Métrica de Usabilidade:**
   * O fluxo completo deve ser realizável em **menos de 2 minutos**.
7. **Bloqueio por Ciclo Fechado (RN-02.5):**
   * Se o ciclo semanal estiver com status `FECHADO`, a tela exibe mensagem informativa clara: *"O ciclo de compras desta semana foi encerrado. Aguarde a abertura do próximo."*, desabilitando os botões de envio.

---

## 3. Pilar 2: Fluxo do Comprador/Gestor (Web Desktop)

O painel de compras e gestão opera em ambiente web desktop estruturado em **duas abas centrais**:

### 3.1 Controles Gerais de Ciclo

* Exibição do status do ciclo corrente (`ABERTO` ou `FECHADO`).
* Botão de ação protegido: *"Encerrar Pedidos da Semana"* (chama `POST /api/v1/ciclos/{id}/fechar`).
* Seletor de histórico: permite alternar entre o ciclo ativo e ciclos passados fechados (`GET /api/v1/ciclos?status=FECHADO`).

### 3.2 Aba 1 — Visão Consolidada (Negociação & Atacado)

* **Objetivo:** Permitir ao comprador cotar e negociar melhores preços por volume com fornecedores atacadistas.
* **Comportamento:**
  * Agrupamento automático por produto com a soma matemática exata (RN-03.1).
  * Exemplo visual: *Arroz Agulhinha Tipo 1: 20kg [CEI] + 15kg [CCA] + 25kg [CJ] = 60kg total*.
  * Permite exportar/copiar a lista somada para envio ao fornecedor.

### 3.3 Aba 2 — Visão por Serviço (Prestação de Contas & Auditoria)

* **Objetivo:** Conferência física item a item com as Notas Fiscais emitidas e envio ao setor financeiro.
* **Comportamento:**
  * Filtro seletor por Serviço (`CEI`, `CCA` ou `CJ`).
  * Exibição estrita dos itens e quantidades solicitados exclusivamente por aquele Centro de Custo (RN-04.2).
  * Exibição das observações de texto livre submetidas pelo respectivo serviço.
  * **Exportação em PDF e Impressão:** Botão de ação para gerar documento formatado para impressão física, contendo cabeçalho com identificação do Centro de Custo, data do ciclo e relação de itens para conferência na entrega física da mercadoria.

---

## 4. Invariantes de Usabilidade e Acessibilidade

1. **Responsividade Pura:** Não desenvolver aplicativo nativo. Toda a experiência deve ser acessível via navegador mobile/desktop.
2. **Prevenção de Erros de Submissão:**
   * Bloquear envio se nenhuma quantidade for superior a zero (RN-02.2).
   * Confirmação visual simples antes do envio final.
