# 📝 The Lazy Copypaste

O **The Lazy Copypaste** é um gerenciador de textos e snippets focado em produtividade e privacidade extrema. Desenvolvido para quem precisa de agilidade no "copia e cola" do dia a dia, ele mantém todos os seus dados salvos localmente, direto no seu navegador.

![Versão](https://img.shields.io/badge/version-1.1.0-blueviolet)
![Status](https://img.shields.io/badge/status-Local--First-success)

---

## ✨ Por que usar o The Lazy Copypaste?

Ao contrário de outros gerenciadores que dependem de nuvem e contas, o The Lazy Copypaste prioriza você:

* **🔒 Privacidade Total:** Seus textos nunca saem do seu dispositivo. Não usamos bancos de dados externos.
* **⚡ Velocidade Instantânea:** Sem latência de rede. O acesso aos seus snippets é imediato.
* **📱 Mobile Friendly:** Leve seus dados do PC para o celular facilmente através do sistema de Backup.
* **🚫 Sem Contas:** Chega de lembrar senhas. Abra o site e comece a usar.

---

## 🎨 Nova Identidade Visual

O projeto agora conta com uma interface moderna baseada na paleta **Slate & Violet**, proporcionando um ambiente de trabalho elegante e menos cansativo para os olhos.

* **Cards Interativos:** Organize seus textos em cards com sombras suaves e feedback visual.
* **Busca Inteligente:** Encontre qualquer snippet instantaneamente pelo título ou conteúdo.

---

## 💾 Sistema de Backup (PC ↔ Celular)

Como os dados são locais (IndexedDB), criamos um sistema simples para você sincronizar seus dispositivos:

1.  No seu computador, clique em **Exportar Backup**.
2.  Envie o arquivo `.json` gerado para o seu celular.
3.  No celular, acesse o site e clique em **Importar Backup**.
4.  Pronto! Seus textos estarão sincronizados.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3 (Custom Properties), JavaScript (ES6+).
* **Banco de Dados Local:** [Dexie.js](https://dexie.org/) (Wrapper robusto para IndexedDB).
* **Servidor:** [Node.js](https://nodejs.org/) com Express (Apenas para servir os arquivos estáticos).

---

## 🚀 Como rodar localmente

Se você deseja rodar o projeto na sua máquina:

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/papaiel-dev/the-lazy-copypaste.git](https://github.com/papaiel-dev/the-lazy-copypaste.git)
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor:
    ```bash
    npm start
    ```
4.  Acesse: `http://localhost:3000`

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**The Lazy Copypaste** - *Feito para quem tem preguiça de digitar, mas não abre mão da segurança.*
