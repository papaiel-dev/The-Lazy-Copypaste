# Gerenciador de Feedbacks - Lazy Copypaste®

**[Acesse a Aplicação Ao Vivo!](https://feedback-manager-2-0.onrender.com/)** 🚀

---

Uma aplicação web completa e multiusuário, construída com uma arquitetura moderna usando Node.js para servir o frontend e Supabase como Backend-as-a-Service (BaaS). Projetada para permitir que múltiplos usuários cadastrem, gerenciem e copiem textos de feedback de forma segura e eficiente, com os dados de cada usuário sendo completamente isolados através de Row-Level Security.

## ✨ Funcionalidades Principais

-   ✅ **Publicação Online:** Aplicação publicada na nuvem através do Render, com deploy contínuo a partir do GitHub.
-   ✅ **Autenticação Completa e Segura:**
    -   Sistema de Cadastro e Login via modal, sem recarregar a página.
    -   Fluxo de **Recuperação de Senha** com envio de e-mail.
    -   Gerenciamento de sessão seguro utilizando JSON Web Tokens (JWT) tratados pelo Supabase.
-   ✅ **Gerenciamento de Conta de Usuário:**
    -   Página dedicada para o usuário alterar seu nome e senha.
    -   (Em breve) Funcionalidade para deletar a própria conta.
-   ✅ **Multi-Tenancy (Privacidade Total):**
    -   Cada feedback pertence a um usuário específico.
    -   Regras de segurança a nível de banco de dados (RLS) garantem que um usuário só possa ver e manipular **seus próprios dados**.
-   ✅ **Busca Inteligente:** Uma interface de busca que exibe uma lista completa e ordenada de todos os feedbacks do usuário, com um filtro que oferece sugestões dinâmicas em tempo real.
-   ✅ **Gerenciamento Completo de Feedbacks (CRUD):**
    -   Área dedicada para o usuário Criar, Ler, Atualizar e Deletar seus próprios feedbacks.
    -   Validação para impedir a criação de feedbacks com títulos duplicados para o mesmo usuário.
-   ✅ **Design Profissional e Responsivo:**
    -   Interface moderna e agradável, com temas visuais distintos para a área pública e a área logada.
    -   Layout totalmente responsivo para uma ótima experiência em desktops e dispositivos móveis.
    -   Componentes de UX polidos, como modais, mensagens de status e telas de "estado vazio".

## 🚀 Tecnologias Utilizadas

* **Hospedagem:**
    * **Aplicação:** Render (Web Service)
    * **Banco de Dados:** Supabase (PostgreSQL com RLS)
* **Backend (Servidor de Arquivos):**
    * Node.js, Express.js
* **Frontend**:
    * HTML5, CSS3, JavaScript (Vanilla JS)
    * **Comunicação com Backend:** `supabase-js`
* **Versionamento**:
    * Git & GitHub (com fluxo de deploy contínuo)

## 🔧 Como Rodar o Projeto Localmente

1.  **Clone o repositório**:
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    ```
    *(Substitua pela URL do seu repositório no GitHub)*

2.  **Navegue até a pasta do projeto**:
    ```bash
    cd nome-do-seu-repositorio
    ```

3.  **Crie o arquivo `.env`**: Copie o `.env.example` para um novo arquivo chamado `.env` e preencha com suas chaves do Supabase.

4.  **Instale as dependências**:
    ```bash
    npm install
    ```

5.  **Inicie o servidor**:
    ```bash
    node index.js
    ```
    A aplicação estará rodando em [http://localhost:3000](http://localhost:3000).

## 🛣️ Roadmap Futuro

Com a versão 1.0 no ar, os próximos passos planejados para a evolução do Feedback Manager são:

-   [ ] **Implementação Segura da Exclusão de Conta (LGPD):**
    -   Criar uma "Edge Function" segura no Supabase ou uma rota de API protegida que use a chave de administrador para deletar um usuário e todos os seus dados de forma irreversível.
-   [ ] **Construção da Página "Sobre":**
    -   Criar uma página estática que explique a missão e a história do projeto.
-   [ ] **Construção da Página de "Contato":**
    -   Criar uma página com informações de contato ou um formulário funcional (usando um serviço como Formspree ou uma função serverless).
-   [ ] **Funcionalidades Avançadas de Feedback:**
    -   Adicionar um sistema de **Tags ou Categorias** para organizar os feedbacks.
    -   Implementar um editor de **Rich Text** para permitir formatação (negrito, itálico, listas) no conteúdo dos feedbacks.
-   [ ] **Painel de Controle do Usuário:**
    -   Criar uma seção de estatísticas no Dashboard, como "número total de feedbacks" ou "feedbacks mais usados".
