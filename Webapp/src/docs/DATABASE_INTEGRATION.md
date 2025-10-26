# 🗄️ Database Integration Guide

Esta guia explica como configurar e usar a integração simples com o banco de dados PostgreSQL/Supabase.

## 📊 Estrutura do Banco de Dados

O sistema gerencia duas tabelas principais:

### 1. Tabela `jobs`
Armazena informações sobre vagas de emprego:

```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID,
  job_key TEXT,
  title TEXT,
  scoring_scale TEXT DEFAULT '1–5',
  rubric TEXT DEFAULT '1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional',
  eligibility_filters JSONB,
  weights JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  description TEXT
);
```

### 2. Tabela `evaluations`
Armazena avaliações de candidatos:

```sql
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id TEXT,
  job_id TEXT,
  run_id TEXT,
  scoring_scale TEXT,
  rubric TEXT,
  timestamp_utc TIMESTAMP DEFAULT NOW(),
  professional_experience JSONB,
  technical_skills JSONB,
  motivation JSONB,
  education_learning JSONB,
  soft_skills_behavioral JSONB,
  eligibility_filters JSONB,
  overall JSONB,
  candidate_name TEXT,
  candidate_phone TEXT
);
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Configure suas credenciais no `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://evsymppxmhfvfgmkviij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here

# Database Connection String (opcional)
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.evsymppxmhfvfgmkviij.supabase.co:5432/postgres
```

### 2. Políticas de Acesso (RLS)

Se você estiver usando Supabase, configure as políticas de acesso:

```sql
-- Habilitar RLS nas tabelas
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Política para jobs (leitura e escrita públicas para demo)
CREATE POLICY "Allow all operations on jobs" ON jobs FOR ALL USING (true);

-- Política para evaluations (leitura e escrita públicas para demo)
CREATE POLICY "Allow all operations on evaluations" ON evaluations FOR ALL USING (true);
```

## 🚀 Uso

### Modo Demo vs Live

O sistema tem dois modos de operação:

- **Demo Mode**: Usa dados fictícios para demonstração
- **Live Mode**: Conecta ao banco de dados real

Use o toggle no header para alternar entre os modos.

### Gerenciamento de Jobs

```tsx
import { JobsManagement } from './components/JobsManagement';

function App() {
  return (
    <div>
      <JobsManagement />
    </div>
  );
}
```

### Operações Programáticas

```tsx
import { useData } from './contexts/DataContext';

function MyComponent() {
  const { 
    jobs, 
    evaluations, 
    addJob, 
    editJob, 
    removeJob,
    addEvaluation 
  } = useData();

  const createNewJob = async () => {
    const newJob = await addJob({
      title: "React Developer",
      description: "Senior React Developer position",
      weights: {
        professional_experience: 0.30,
        technical_skills: 0.35,
        motivation: 0.15,
        education_learning: 0.10,
        soft_skills_behavioral: 0.10,
      }
    });
  };

  const createEvaluation = async () => {
    const evaluation = await addEvaluation({
      candidate_id: "user@example.com",
      job_id: "job-uuid",
      candidate_name: "Mario Rossi",
      candidate_phone: "+39 123 456 7890",
    });
  };
}
```

## 📡 API Endpoints

O sistema usa a REST API do Supabase:

### Jobs
- `GET /rest/v1/jobs` - Lista todos os jobs
- `POST /rest/v1/jobs` - Cria novo job
- `PATCH /rest/v1/jobs?id=eq.{id}` - Atualiza job
- `DELETE /rest/v1/jobs?id=eq.{id}` - Remove job

### Evaluations
- `GET /rest/v1/evaluations` - Lista todas as avaliações
- `GET /rest/v1/evaluations?job_id=eq.{jobId}` - Avaliações por job
- `POST /rest/v1/evaluations` - Cria nova avaliação
- `PATCH /rest/v1/evaluations?id=eq.{id}` - Atualiza avaliação
- `DELETE /rest/v1/evaluations?id=eq.{id}` - Remove avaliação

## 🔄 Integração com SmartReq

Quando um candidato envia sua aplicação:

1. O CV é convertido para texto usando PDF.js
2. Os dados são enviados para a API SmartReq
3. Se bem-sucedido, uma nova avaliação é salva no banco de dados
4. A avaliação fica disponível no dashboard

## 🛠️ Estrutura dos Arquivos

```
src/
├── utils/database/
│   ├── config.ts      # Configuração do banco
│   ├── types.ts       # Tipos TypeScript
│   └── api.ts         # Funções de API
├── hooks/
│   └── useDatabase.ts # Hook React para dados
├── contexts/
│   └── DataContext.tsx # Contexto global
└── components/
    ├── JobsManagement.tsx    # Gerenciamento de jobs
    ├── DataModeToggle.tsx    # Toggle demo/live
    └── CandidateApplicationForm.tsx # Formulário integrado
```

## 🔍 Troubleshooting

### Problemas Comuns

1. **Erro de CORS**: Verifique se o domínio está configurado no Supabase
2. **Permissões**: Confirme as políticas RLS
3. **Variáveis de ambiente**: Certifique-se de que estão corretas
4. **API Key**: Use a chave `anon` pública, não a `service_role`

### Debug

Para debugar conexões, use o console do navegador:

```javascript
// Verificar configuração
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

// Testar conexão
fetch('https://evsymppxmhfvfgmkviij.supabase.co/rest/v1/jobs', {
  headers: {
    'apikey': 'your-anon-key',
    'Authorization': 'Bearer your-anon-key'
  }
}).then(r => r.json()).then(console.log);
```

## 📈 Próximos Passos

1. **Autenticação**: Implementar login de usuários
2. **Permissões**: Configurar RLS mais granular
3. **Cache**: Implementar cache local para melhor performance
4. **Realtime**: Usar subscriptions do Supabase para updates em tempo real
5. **Analytics**: Adicionar métricas e analytics
6. **Export**: Funcionalidade para exportar dados

## 🆘 Suporte

Se você encontrar problemas:

1. Verifique os logs do console do navegador
2. Confirme a configuração do Supabase
3. Teste a conectividade com as APIs
4. Verifique as permissões do banco de dados