# The Lazy Copypaste

**[Acesse a Aplicação Ao Vivo!](https://the-lazy-copypaste.vercel.app/)** 🚀

---

Uma aplicação web completa e multiusuário, construída com uma arquitetura moderna usando um frontend estático e o Supabase como Backend-as-a-Service (BaaS). Projetada para permitir que múltiplos usuários cadastrem, gerenciem e copiem textos e snippets de forma segura e eficiente, com os dados de cada usuário sendo completamente isolados através de Row-Level Security.

## ✨ Funcionalidades Principais

-   ✅ **Publicação Online:** Aplicação publicada na nuvem através da Vercel, com deploy contínuo a partir do GitHub.
-   ✅ **Autenticação Completa e Segura:**
    -   Sistema de Cadastro e Login via modal.
    -   **Gerenciamento de Sessão Persistente:** O usuário permanece logado mesmo após fechar o navegador e é redirecionado automaticamente.
    -   Fluxo de **Recuperação de Senha** com envio de e-mail e página de redefinição.
-   ✅ **Gerenciamento de Conta de Usuário (LGPD):**
    -   Página dedicada para o usuário alterar seu nome e senha.
    -   Funcionalidade de **exclusão de conta segura**, permitindo ao usuário deletar todos os seus dados de forma irreversível.
-   ✅ **Páginas Institucionais:**
    -   Páginas "Sobre" e "Contato" com navegação através de um rodapé unificado.
-   ✅ **Multi-Tenancy (Privacidade Total)::**
    -   Cada texto pertence a um usuário específico.
    -   Regras de segurança a nível de banco de dados (RLS) garantem que um usuário só possa ver e manipular **seus próprios dados**.
-   ✅ **Busca Inteligente:** Uma interface de busca que exibe uma lista completa e ordenada de todos os textos do usuário, com um filtro que oferece sugestões dinâmicas em tempo real.
-   ✅ **Gerenciamento Completo de Conteúdo (CRUD):**
    -   Área dedicada para o usuário Criar, Ler, Atualizar e Deletar seus próprios textos.
    -   Validação para impedir a criação de textos com títulos duplicados para o mesmo usuário.
-   ✅ **Design Profissional e Responsivo:**
    -   Interface moderna com temas visuais distintos para a área pública e a área logada.
    -   Layout totalmente responsivo para uma ótima experiência em desktops e dispositivos móveis.
    -   Componentes de UX polidos, como modais, mensagens de status e telas de "estado vazio".

## 🚀 Tecnologias Utilizadas

* **Hospedagem:**
    * **Frontend:** Vercel (Static Hosting + Serverless Functions)
    * **Backend (BaaS):** Supabase (Auth, PostgreSQL com RLS)
* **Frontend**:
    * HTML5, CSS3, JavaScript (Vanilla JS)
    * **Comunicação com Backend:** `supabase-js`
* **Versionamento**:
    * Git & GitHub (com fluxo de deploy contínuo)

## 🔧 Como Rodar o Projeto Localmente

Como a aplicação é um site estático que se conecta a um backend na nuvem (Supabase), usamos um servidor de desenvolvimento simples para rodar localmente.

### Pré-requisitos

-   [**Git**](https://git-scm.com/downloads)
-   **VS Code** com a extensão [**Live Server**](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

### Passos para Instalação

1.  **Clone o repositório**:
    ```bash
    git clone [https://github.com/papaiel-dev/The-Lazy-Copypaste.git](https://github.com/papaiel-dev/The-Lazy-Copypaste.git)
    ```
2.  **Navegue até a pasta do projeto**:
    ```bash
    cd The-Lazy-Copypaste
    ```
3.  **Configure as chaves do Supabase**:
    * No arquivo `public/supabaseClient.js`, insira suas chaves do Supabase nos locais indicados.
4.  **Inicie o servidor local com o Live Server**:
    * Abra a pasta do projeto no VS Code.
    * No painel de arquivos, clique com o botão direito no arquivo `public/index.html`.
    * Selecione **"Open with Live Server"**.

    Uma nova aba do navegador abrirá automaticamente, com a sua aplicação funcionando!

## 🛣️ Roadmap Futuro

-   [ ] **Funcionalidades Avançadas de Conteúdo:**
    -   Adicionar um sistema de **Tags ou Categorias** para organizar os textos.
    -   Implementar um editor de **Rich Text** para permitir formatação (negrito, itálico, listas).
-   [ ] **Melhorias no Dashboard:**
    -   Criar uma seção de estatísticas, como "número total de textos" ou "textos mais copiados".
-   [ ] **Formulário de Contato Funcional:**
    -   Integrar a página de "Contato" com um serviço (como Formspree) ou uma Função Serverless para que o envio de mensagens funcione.