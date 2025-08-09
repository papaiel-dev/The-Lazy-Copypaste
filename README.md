# Gerenciador de Feedbacks

Uma aplicação web completa construída com Node.js, Express e SQLite para armazenar, gerenciar e copiar textos de feedback de forma eficiente. O projeto foi estruturado com um portal de entrada que separa as funcionalidades de busca e gerenciamento de dados.

## ✨ Funcionalidades

* **Portal de Entrada**: Uma página inicial que direciona o usuário para as duas áreas principais da aplicação.
* **Busca Inteligente**: Uma interface de busca que exibe uma lista completa e ordenada de todos os feedbacks, com um campo de filtro que oferece sugestões dinâmicas (autocomplete) em tempo real.
* **Visualização e Cópia**: Permite selecionar um feedback da lista para ver seus detalhes e copiar seu conteúdo para a área de transferência com um clique.
* **Gerenciamento Completo (CRUD)**: Uma área dedicada para administradores onde é possível Criar, Ler, Atualizar e Deletar feedbacks.
* **Interface Intuitiva**: Fluxos de trabalho lógicos, como o redirecionamento automático para a lista de gerenciamento após salvar uma edição.

## 🚀 Tecnologias Utilizadas

* **Backend**:
    * Node.js
    * Express.js
* **Banco de Dados**:
    * SQLite 3
* **Frontend**:
    * HTML5
    * CSS3
    * JavaScript (Vanilla JS)

## 🔧 Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar a aplicação em um novo ambiente.

### Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados na sua máquina:

* [**Node.js**](https://nodejs.org/en/) (versão 18.x ou superior recomendada)
* [**Git**](https://git-scm.com/downloads)

### Passos para Instalação

1.  **Clone o repositório** para a sua máquina local:
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    ```
    *(Substitua pela URL do seu repositório no GitHub)*

2.  **Navegue até a pasta do projeto**:
    ```bash
    cd nome-do-seu-repositorio
    ```

3.  **Instale as dependências** do projeto. Este comando lê o `package.json` e baixa as bibliotecas necessárias (Express, SQLite3):
    ```bash
    npm install
    ```

4.  **Inicie o servidor**:
    ```bash
    node index.js
    ```

5.  Abra seu navegador e acesse [http://localhost:3000](http://localhost:3000). A aplicação estará funcionando!

## 🛣️ Próximos Passos (Roadmap)

O plano de evolução para este projeto inclui:

-   [ ] Implementação de **autenticação de usuários** (Login/Cadastro).
-   [ ] **Multi-tenancy** para isolamento completo de dados por usuário.
-   [ ] **Design Responsivo** para uma melhor experiência em dispositivos móveis.
-   [ ] Migração do banco de dados para **PostgreSQL**.
-   [ ] **Deployment** da aplicação em um serviço