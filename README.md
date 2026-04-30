# buscacep-arthur-nr
# 📦 Busca CEP - PWA

Aplicação web progressiva (PWA) para consulta de endereços a partir do CEP, utilizando a API pública ViaCEP.

🔗 **Acesse a aplicação:**
👉 https://buscacep-arthur-nr.netlify.app/

---

## 📌 1. Sobre o Projeto

### 📝 Descrição

O **Busca CEP** é uma aplicação web que permite ao usuário consultar informações de endereço (logradouro, bairro, cidade e estado) a partir de um CEP informado.

A aplicação foi desenvolvida com foco em simplicidade, desempenho e acessibilidade, sendo adaptada para o modelo **Progressive Web App (PWA)**.

---

### 🎯 Objetivo

* Facilitar a busca de endereços de forma rápida
* Aplicar conceitos modernos de desenvolvimento web (PWA)
* Proporcionar uma experiência semelhante a aplicativos nativos
* Permitir uso parcial mesmo sem conexão com a internet

---

### 🛠️ Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* API ViaCEP
* Service Worker
* Web App Manifest
* Chatgpt(fins de pesquisas e direcionamento)
  

---

## 📱 2. Conceitos de PWA

### 🔹 O que é uma PWA?

Uma **Progressive Web App (PWA)** é uma aplicação web que utiliza tecnologias modernas para oferecer uma experiência semelhante a aplicativos nativos, podendo ser instalada no dispositivo do usuário.

---

### ⭐ Principais Características

* Aplicação leve e rápida
* Funciona em qualquer navegador moderno
* Pode ser instalada no dispositivo
* Possui suporte a funcionamento offline
* Atualizações automáticas

---

### 📲 Instalável

A aplicação pode ser instalada diretamente pelo navegador, permitindo acesso rápido pela tela inicial do dispositivo, sem necessidade de lojas como Play Store.

---

### 🌐 Offline (Service Worker)

A aplicação utiliza um **Service Worker** para armazenar arquivos em cache, permitindo que a interface seja carregada mesmo sem conexão com a internet.

---

### 📱 Responsividade

A interface foi desenvolvida de forma responsiva, adaptando-se a diferentes tamanhos de tela, incluindo dispositivos móveis.

---

### 📄 manifest.json

Arquivo responsável por definir:

* Nome da aplicação
* Ícones
* Cores do tema
* Comportamento de exibição (modo app)

---

### ⚙️ Service Worker

Script que atua como um intermediário entre a aplicação e a rede, permitindo:

* Cache de arquivos
* Funcionamento offline
* Melhor desempenho

---

## ▶️ 3. Como rodar o projeto localmente

### 🔹 Opção 1 - Live Server (Recomendado)

1. Instale a extensão **Live Server** no VS Code
2. Clique com o botão direito no arquivo `index.html`
3. Selecione **"Open with Live Server"**

---

### 🔹 Opção 2 - Servidor local simples

Usando Python:

```bash
python -m http.server
```

Ou usando Node.js:

```bash
npx serve
```

---

## 🚀 4. Como fazer o Deploy

A aplicação foi publicada utilizando o **Netlify**.

---

### 🔹 Passo a passo

1. Acessei o site do Netlify
2. Fiz login com minha conta GitHub
3. Cliquei em **"Add new site" → "Import an existing project"**
4. Selecione o repositório `buscacep_arthur_nr`
5. Alterei o dominio para 'buscacep-arthur-nr.netlify.app'
---

## 📌 Considerações Finais

Este projeto demonstra a aplicação prática dos conceitos de **Progressive Web Apps**, combinando simplicidade com funcionalidades modernas como instalação e suporte offline.

Além disso, reforça conhecimentos em:

* Consumo de APIs
* Estruturação de aplicações web
* Experiência do usuário (UX)

---

## 👨‍💻 Autor

Desenvolvido por **Arthur Barreto**
