# The Lazy Copypaste

**[Acesse a Aplicação Ao Vivo!](https://the-lazy-copypaste.vercel.app/)** 🚀

---

Uma aplicação web completa e multiusuário, construída com uma arquitetura moderna usando um frontend estático e o Supabase como Backend-as-a-Service (BaaS). Projetada para permitir que múltiplos usuários cadastrem, gerenciem e copiem textos e snippets de forma segura e eficiente.

## ✨ Funcionalidades Principais

-   ✅ **Publicação Online:** Aplicação publicada na nuvem através da Vercel, com deploy contínuo a partir do GitHub.
-   ✅ **Autenticação Completa e Segura:**
    -   Sistema de Cadastro e Login via modal.
    -   Fluxo de **Recuperação de Senha** com envio de e-mail e página de redefinição.
-   ✅ **Gerenciamento de Conta de Usuário (LGPD):**
    -   Página dedicada para o usuário alterar seu nome e senha.
    -   Funcionalidade de **exclusão de conta segura**, permitindo ao usuário deletar todos os seus dados.
-   ✅ **Páginas Institucionais:**
    -   Páginas "Sobre" e "Contato" com navegação através de um rodapé unificado.
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

* **Hospedagem:** Vercel (Static Hosting + Serverless Functions)
* **Backend (BaaS):** Supabase (Auth, PostgreSQL com RLS)
* **Frontend**: HTML5, CSS3, JavaScript (Vanilla JS)
* **Versionamento**: Git & GitHub

## 🛣️ Roadmap Futuro

-   [ ] **Funcionalidades Avançadas de Conteúdo:**
    -   Adicionar um sistema de **Tags ou Categorias** para organizar os textos.
    -   Implementar um editor de **Rich Text** para permitir formatação (negrito, itálico, listas).
-   [ ] **Melhorias no Dashboard:**
    -   Criar uma seção de estatísticas, como "número total de textos" ou "textos mais copiados".
-   [ ] **Formulário de Contato Funcional:**
    -   Integrar a página de "Contato" com um serviço (como Formspree) ou uma Função Serverless para que o envio de mensagens funcione.