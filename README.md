# Gerenciador de Feedbacks

Uma aplicação web completa e multiusuário, construída com Node.js, Express e SQLite. Projetada para permitir que múltiplos usuários cadastrem, gerenciem e copiem textos de feedback de forma segura e eficiente, com os dados de cada usuário sendo completamente isolados.

## ✨ Funcionalidades

-   ✅ **Autenticação Segura:** Sistema de cadastro e login com senhas criptografadas (`bcrypt`) e gerenciamento de sessão via JSON Web Tokens (JWT) em cookies.
-   ✅ **Interface Pública e Privada:**
    -   Uma página de aterrissagem (`landing page`) profissional para apresentar a aplicação.
    -   Um modal elegante para login/cadastro sem a necessidade de recarregar a página.
    -   Uma área interna (Dashboard) protegida, acessível apenas para usuários logados.
-   ✅ **Multi-Tenancy (Isolamento de Dados):** Cada feedback cadastrado pertence a um usuário específico, garantindo total privacidade dos dados.
-   ✅ **Busca Inteligente:** Uma interface de busca que exibe uma lista completa e ordenada de **seus** feedbacks, com um filtro que oferece sugestões dinâmicas em tempo real.
-   ✅ **Gerenciamento Completo (CRUD):** Uma área dedicada para o usuário Criar, Ler, Atualizar e Deletar **seus próprios** feedbacks.
-   ✅ **Design Responsivo:** A interface se adapta para uma experiência de uso agradável tanto em desktops quanto em dispositivos móveis.
-   ✅ **Melhorias de UX:** Validação de senhas, opção de mostrar/ocultar senha, mensagens de sucesso, e telas de "estado vazio" para guiar o usuário.

## 🚀 Tecnologias Utilizadas

* **Backend**:
    * Node.js, Express.js
    * **Segurança:** `bcrypt`, `jsonwebtoken`, `cookie-parser`
* **Banco de Dados**:
    * SQLite 3
* **Frontend**:
    * HTML5, CSS3, JavaScript (Vanilla JS)
* **Versionamento**:
    * Git & GitHub

## 🔧 Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar a aplicação em um novo ambiente.

### Pré-requisitos

-   [**Node.js**](https://nodejs.org/en/) (v18.x ou superior)
-   [**Git**](https://git-scm.com/downloads)

### Passos para Instalação

1.  **Clone o repositório**:
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    ```
    *(Substitua pela URL do seu repositório no GitHub)*

2.  **Navegue até a pasta do projeto**:
    ```bash
    cd nome-do-seu-repositorio
    ```

3.  **Instale as dependências**:
    ```bash
    npm install
    ```

4.  **Inicie o servidor**:
    ```bash
    node index.js
    ```
    A aplicação estará rodando em [http://localhost:3000](http://localhost:3000).

### Como Usar a Aplicação

1.  Após iniciar o servidor, acesse `http://localhost:3000`.
2.  Você verá a página de apresentação. Clique em **"Cadastre-se Grátis"** para criar sua conta através do modal.
3.  Após o cadastro, use o mesmo modal para fazer **login**.
4.  Você será redirecionado para o seu **Dashboard**, de onde pode acessar as áreas de Busca e Gerenciamento dos seus feedbacks.

## 🛣️ Roadmap do Projeto

-   [x] ~~Autenticação de Usuários e Segurança de Senha~~ (Concluído)
-   [x] ~~Multi-Tenancy para Isolamento de Dados~~ (Concluído)
-   [x] ~~Design Responsivo e Melhorias de UX~~ (Concluído)
-   [ ] **Próximo Passo:** Publicação (Deployment) e Migração para PostgreSQL.