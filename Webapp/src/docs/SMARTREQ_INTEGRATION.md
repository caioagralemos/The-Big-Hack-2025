# SmartReq API Integration

Esta integração permite que o formulário de candidatura se conecte com a API SmartReq para avaliação automatizada de candidatos.

## Funcionalidades Implementadas

### 1. Upload e Conversão de PDF
- **CV Upload**: Upload obrigatório do CV em formato PDF
- **LinkedIn PDF**: Upload opcional do perfil LinkedIn em PDF
- **Conversão para Texto**: Utiliza `pdfjs-dist` para converter PDFs em texto

### 2. Validação de Dados
- Validação de campos obrigatórios (nome, email, telefone, CV)
- Validação de consent/consentimento
- Verificação de formato de arquivos (apenas PDF para LinkedIn)

### 3. Integração com SmartReq API
- Envio automático dos dados para `https://primary-production-6beb.up.railway.app/webhook/smartreq`
- Estrutura de payload conforme documentação da API
- Tratamento de erros e respostas

## Estrutura do Payload

```json
{
  "name": "Nome do Candidato",
  "phone_number": "+39 123 456 7890",
  "email": "candidato@example.com",
  "cv": "Texto extraído do PDF do CV...",
  "linkedin": "Texto extraído do PDF do LinkedIn (opcional)...",
  "job_offer": {
    "id": "job_id_unique",
    "title": "Título da Vaga",
    "description": "Descrição da vaga...",
    "company_id": "uuid-da-empresa",
    "scoring_scale": "1–5",
    "rubric": "1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional",
    "eligibility_filters": ["filtro1", "filtro2"],
    "weights": {
      "professional_experience": 0.30,
      "technical_skills": 0.35,
      "motivation": 0.15,
      "education_learning": 0.10,
      "soft_skills_behavioral": 0.10
    },
    "created_at": "2025-10-26T10:00:00Z",
    "updated_at": "2025-10-26T10:00:00Z"
  }
}
```

## Mudanças Feitas

### Removidas
- Seção "Link Opzionali" (GitHub, website, Instagram)
- Campo de LinkedIn como URL (agora apenas PDF)
- Portfolio genérico (substituído por LinkedIn PDF específico)

### Adicionadas
- Upload específico para LinkedIn PDF
- Validação de tipos TypeScript
- Utilitários para SmartReq API (`src/utils/smartreq-api.ts`)
- Tratamento de erros melhorado

### Modificadas
- `CandidateApplicationForm.tsx`: Integração completa com SmartReq API
- Estado do formulário simplificado
- Processo de parsing de PDF otimizado

## Como Usar

1. **Instalar Dependências**:
   ```bash
   npm install pdfjs-dist
   npm install --save-dev @types/react @types/react-dom
   ```

2. **Configurar Job Offer**:
   ```tsx
   import { createDefaultJobOffer } from '../utils/smartreq-api';
   
   const jobOffer = createDefaultJobOffer({
     id: "ios_engineer_2025",
     title: "iOS Engineer",
     description: "Seeking experienced iOS developer...",
   });
   ```

3. **Usar o Formulário**:
   ```tsx
   <CandidateApplicationForm
     role={{ title: "iOS Engineer" }}
     jobOffer={jobOffer}
     onSubmit={(data) => console.log('Submitted:', data)}
   />
   ```

## Fluxo de Funcionamento

1. **Passo 1**: Candidato preenche informações básicas (nome, email, telefone)
2. **Passo 2**: Upload do CV (obrigatório) e LinkedIn PDF (opcional)
3. **Validação**: Verifica se todos os campos obrigatórios estão preenchidos
4. **Parsing**: Converte PDFs para texto usando PDF.js
5. **API Call**: Envia dados para SmartReq API
6. **Resposta**: Processa resposta e mostra confirmação

## Tratamento de Erros

- **PDF Parsing**: Erros de parsing são capturados e logados
- **API Errors**: Erros da API são mostrados ao usuário
- **Network Errors**: Problemas de rede são tratados graciosamente
- **Validation**: Validação client-side antes do envio

## Resposta da API

Sucesso (200):
```json
{
  "ok": true,
  "candidate_id": "candidato@example.com",
  "evaluation_id": "uuid-da-avaliacao",
  "received": {
    "cv": true,
    "linkedin": true
  },
  "next": "We'll send 0–2 clarifying questions if needed."
}
```

Erro (400/422/500):
```json
{
  "error": "Descrição do erro"
}
```

## Notas Importantes

- **Tamanho de Arquivo**: PDFs devem ser menores que 10MB
- **Formato**: Apenas PDFs são aceitos para LinkedIn
- **Weights**: Os pesos em `job_offer.weights` devem somar 1.0
- **Email Único**: O email é usado como identificador único do candidato
- **Texto Apenas**: A API espera texto, não binários de PDF