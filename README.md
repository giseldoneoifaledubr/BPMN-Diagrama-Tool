# BPMN Designer

Uma ferramenta moderna e intuitiva para criar diagramas BPMN com o poder da Inteligência Artificial.

## 🚀 Características

- **Interface Drag & Drop**: Crie diagramas facilmente arrastando elementos
- **IA Integrada**: Modifique diagramas usando linguagem natural com Groq AI
- **Autenticação Supabase**: Login seguro com salvamento na nuvem
- **Modo Local**: Funciona offline salvando no navegador
- **Exportação**: Suporte para BPMN 2.0 e Mermaid
- **Pools e Lanes**: Organize elementos por participantes
- **Responsivo**: Interface adaptável para diferentes dispositivos

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Autenticação**: Supabase Auth
- **Banco de Dados**: Supabase (PostgreSQL)
- **IA**: Groq API
- **Ícones**: Lucide React

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Supabase (opcional, para salvamento na nuvem)
- Chave API Groq (opcional, para funcionalidades de IA)

## 🔧 Configuração

### 1. Clone o repositório
```bash
git clone <repository-url>
cd bpmn-designer
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase Configuration (opcional)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Configure o Supabase (opcional)

Se você quiser usar o salvamento na nuvem, configure o Supabase:

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute as migrações SQL fornecidas em `supabase/migrations/`
3. Configure as variáveis de ambiente com suas credenciais

### 5. Execute o projeto
```bash
npm run dev
```

## 🗄️ Estrutura do Banco de Dados

O projeto usa duas tabelas principais:

### user_profiles
- `id` (uuid, PK) - Referência ao usuário do Supabase Auth
- `email` (text) - Email do usuário
- `full_name` (text) - Nome completo
- `created_at` (timestamptz) - Data de criação
- `updated_at` (timestamptz) - Data de atualização

### diagrams
- `id` (uuid, PK) - ID único do diagrama
- `user_id` (uuid, FK) - Referência ao usuário
- `name` (text) - Nome do diagrama
- `elements` (jsonb) - Elementos BPMN
- `connections` (jsonb) - Conexões entre elementos
- `pools` (jsonb) - Pools e lanes
- `created_at` (timestamptz) - Data de criação
- `updated_at` (timestamptz) - Data de atualização

## 🔐 Autenticação

O sistema suporta dois modos:

### Modo Local
- Diagramas salvos no localStorage do navegador
- Não requer configuração adicional
- Dados limitados ao dispositivo atual

### Modo Nuvem (Supabase)
- Autenticação segura com email/senha
- Diagramas salvos na nuvem
- Acesso de qualquer dispositivo
- Backup automático

## 🤖 Integração com IA

Configure a chave API do Groq para usar funcionalidades de IA:

1. Obtenha uma chave gratuita em [Groq Console](https://console.groq.com/keys)
2. Configure no chat da aplicação
3. Use comandos em linguagem natural para modificar diagramas

Exemplos de comandos:
- "Adicione um evento de início chamado 'Receber Pedido'"
- "Conecte o gateway com a tarefa de aprovação"
- "Crie um pool chamado 'Cliente' na parte superior"

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 🚀 Deploy

### Netlify (Recomendado)
1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Vercel
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Build Manual
```bash
npm run build
# Os arquivos estarão na pasta 'dist'
```

## 🔒 Segurança

- Row Level Security (RLS) habilitado no Supabase
- Usuários só acessam seus próprios dados
- Autenticação JWT segura
- Validação de entrada no frontend e backend

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Giseldo Neo**
- Email: giseldo@gmail.com
- GitHub: [@giseldo](https://github.com/giseldo)

## 🙏 Agradecimentos

- [Supabase](https://supabase.com) - Backend as a Service
- [Groq](https://groq.com) - IA para processamento de linguagem natural
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [Lucide](https://lucide.dev) - Ícones
- [React](https://reactjs.org) - Biblioteca JavaScript