# The Lazy Copypaste

**[Acesse a Aplicação Ao Vivo!](https://the-lazy-copypaste-grwf.vercel.app/)** 🚀

*(Por favor, verifique se este é o seu link final da Vercel e ajuste se necessário)*

---

Uma aplicação web completa e multiusuário, construída com uma arquitetura moderna usando um frontend estático e o Supabase como Backend-as-a-Service (BaaS). Projetada para permitir que múltiplos usuários cadastrem, gerenciem e copiem textos e snippets de forma segura e eficiente, com os dados de cada usuário sendo completamente isolados através de Row-Level Security.

## ✨ Funcionalidades Principais

-   ✅ **Publicação Online:** Aplicação publicada na nuvem através da Vercel, com deploy contínuo a partir do GitHub.
-   ✅ **Autenticação Completa e Segura:**
    -   Sistema de Cadastro e Login via modal.
    -   Fluxo de **Recuperação de Senha** com envio de e-mail e página de redefinição.
    -   Gerenciamento de sessão seguro utilizando o sistema nativo do Supabase.
-   ✅ **Gerenciamento de Conta de Usuário (LGPD):**
    -   Página dedicada para o usuário alterar seu nome e senha.
    -   Funcionalidade de **exclusão de conta segura**, permitindo ao usuário deletar todos os seus dados de forma irreversível.
-   ✅ **Multi-Tenancy (Privacidade Total):**
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

Como a aplicação publicada é um site estático, usamos um servidor de desenvolvimento simples para rodar localmente.

### Pré-requisitos

-   [**Git**](https://git-scm.com/downloads)
-   **VS Code** com a extensão [**Live Server**](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

### Passos para Instalação

1.  **Clone o repositório**:
    ```bash
    git clone [https://github.com/papaiel-dev/The-Lazy-Copypaste.git](https://github.com/papaiel-dev/The-Lazy-Copypaste.git)
    ```
    *(Este é o link do seu repositório, outros usuários podem clonar a partir daqui!)*

2.  **Navegue até a pasta do projeto**:
    ```bash
    cd The-Lazy-Copypaste
    ```
3.  **Configure as chaves do Supabase**:
    * Crie um arquivo `supabaseClient.js` na raiz do projeto (ou dentro da pasta `public` se preferir, ajustando o caminho no HTML).
    * Cole o conteúdo do arquivo `supabaseClient.js` que desenvolvemos, inserindo suas chaves do Supabase.

4.  **Inicie o servidor local com o Live Server**:
    * Abra a pasta do projeto no VS Code.
    * No painel de arquivos, clique com o botão direito no arquivo `index.html` (ou no arquivo que serve como sua página inicial).
    * Selecione **"Open with Live Server"**.

    Uma nova aba do navegador abrirá automaticamente em um endereço como `http://127.0.0.1:5500`, com a sua aplicação funcionando!

## 🛣️ Roadmap Futuro

-   [ ] **Construção da Página "Sobre":**
    -   Criar uma página estática que explique a missão e a história do projeto.
-   [ ] **Construção da Página de "Contato":**
    -   Criar uma página com informações de contato ou um formulário funcional.
-   [ ] **Funcionalidades Avançadas de Conteúdo:**
    -   Adicionar um sistema de **Tags ou Categorias** para organizar os textos.
    -   Implementar um editor de **Rich Text** para permitir formatação (negrito, itálico, listas).
-   [ ] **Melhorias no Dashboard:**
    -   Criar uma seção de estatísticas, como "número total de textos" ou "textos mais copiados".