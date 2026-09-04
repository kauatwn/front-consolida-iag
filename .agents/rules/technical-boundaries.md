---
trigger: always_on
description: "Explicit out-of-scope boundaries, system limits, and architectural invariants for Consolida IAG."
---

# Consolida IAG — Scope Boundaries & Technical Invariants

## Purpose

This rule defines the strict system boundaries, out-of-scope functional areas, and technical invariants for **Consolida IAG**.

These boundaries prevent over-engineering, unnecessary external integrations, and architectural drift. The Agent **MUST NOT** implement features or dependencies related to items marked as out-of-scope.

---

## 1. Out of Scope Boundaries (Fronteiras e Fora do Escopo)

The following capabilities are explicitly outside the scope of the system:

| Área Funcional | Diretriz de Negócio & Restrição Técnica |
| :--- | :--- |
| **Controle de Estoque Ativo** *(Active Inventory Management)* | O sistema **NÃO** deve implementar controle de saldo em almoxarifado, baixa diária de consumo, inventário físico, registro de perdas ou entrada física de mercadorias. |
| **Integração Fiscal** *(Fiscal Integration)* | O sistema **NÃO** deve realizar emissão, recepção, validação de arquivos XML ou comunicação de Notas Fiscais Eletrônicas (NF-e/NFS-e) junto à SEFAZ ou outros órgãos governamentais. |
| **Cotação Financeira e Pagamentos** *(Financial Quotation & Payments)* | O sistema **NÃO** deve integrar APIs de fornecedores para cotação automatizada de preços, gateways de pagamento, controle de contas a pagar/receber ou processamento de transações financeiras. |
| **Aplicativo Mobile Nativo (iOS/Android)** *(Native App Development)* | O sistema **NÃO** deve ser desenvolvido como aplicativo nativo para lojas de apps. A solução adota estritamente arquitetura Web API (Back-end) consumida por Web Responsiva (Front-end). |

> [!NOTE]
> **Proteção do Prazo do MVP (4 meses):** As exclusões acima são mandatadas para viabilizar a entrega técnica no prazo acadêmico estipulado e evitar complexidades desnecessárias na operação e infraestrutura.

---

## 2. Technical Invariants & Data Integrity (Back-end)

### 2.1 Database & Persistence Level

* **Individual Origin Preservation:** Never merge or normalize records across services into a single destructive record. Every requested quantity line item must retain its foreign key / association to the originating `Serviço`.
* **Immutability of Closed Cycles:** Once a cycle reaches `status = 'FECHADO'`, all associated requests and item records are permanently read-only. Updates and deletes MUST be blocked.
* **Transactional Integrity:** Creating or updating a weekly request and its items MUST execute within an atomic database transaction.

### 2.2 Reporting & Projections

* **Consolidated View:** Read-only / derived aggregation across all participating services for supplier negotiation. Must be calculated dynamically or projected from raw requests.
* **Individual View:** Filtered by single `Serviço` (CEI, CCA, or CJ) for reconciliation against physical invoice delivery.

---

## 3. Enforcement Instructions for Agent

1. **Reject Scope Creep:** If asked to add inventory stock deductions, fiscal communication protocols, or payment gateways, alert the user that these are explicitly designated as out-of-scope per this rule.
2. **Preserve Separation:** Keep data models and business logic technology-agnostic at the domain layer, ensuring business rules RN-01 through RN-04 remain invariant.
3. **Repository Scope:** This repository is dedicated to the **Back-end API**. Do not introduce frontend UI styling, React/Vue components, or CSS within this repository.
