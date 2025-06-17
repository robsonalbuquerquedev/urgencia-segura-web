# UrgenciaSeguraWeb

## Portal web desenvolvido em Next.js para monitoramento em tempo real das solicitações de emergência enviadas pelo aplicativo UrgenciaSeguraApp.

Este projeto exibe na interface web os dados armazenados no Firebase Realtime Database, permitindo que profissionais do SAMU e da Defesa Civil acompanhem e gerenciem os atendimentos emergenciais de forma eficiente.

---

## Tecnologias usadas

Next.js - framework React para aplicações web modernas

Firebase Realtime Database - armazenamento em tempo real dos dados de emergência

Integração com API do Firebase para leitura dos dados em tempo real

Docker - para empacotar e rodar a aplicação em qualquer lugar

---

## Formas de execução

### ✅ Acesso pela web (Vercel)

Acesse diretamente o portal online:
🔗 https://urgencia-segura-web.vercel.app

---

### 🧱 Rodando localmente com Docker

Requisitos:

Ter o Docker Desktop instalado

Passo a passo:

```bash
docker run -p 3000:3000 robson098/urgencia-segura-web
```

Depois, acesse http://localhost:3000 no navegador.

---

### 🐳 Rodando com Docker Compose (se você clonou o repositório)

```bash
docker-compose up         # Para rodar o app normalmente

docker-compose up --build  # Use este comando caso:
                           # - Tenha alterado o Dockerfile
                           # - Atualizou o .env.production
                           # - Instalou novas dependências no package.json
```

Para parar:

```bash
docker-compose down
```

---

### 💻 Rodando localmente com npm run dev

Pré-requisitos:

Node.js instalado

.env.local com as variáveis de ambiente do Firebase

Comandos:

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

---

### 🚀 Publicar novas atualizações no Docker Hub
Sempre que quiser atualizar a imagem no Docker Hub após mudar o código:

```bash
# 1. Gere a imagem com nome correto
docker build -t robson098/urgencia-segura-web .

# 2. Envie para o Docker Hub
docker push robson098/urgencia-segura-web
```

---

## Comandos importantes Docker

```bash
docker login
```

```bash
docker images
```

```bash
docker tag urgencia-segura-web-urgencia-segura-web robson098/urgencia-segura-web:latest
```

```bash
docker push robson098/urgencia-segura-web:latest
```

```bash
docker run -p 3000:3000 robson098/urgencia-segura-web
```

---

## Deploy

A forma mais fácil de publicar seu portal é usando a plataforma Vercel, criada pelos desenvolvedores do Next.js. O deploy é feito automaticamente com base no GitHub.

Caso altere .env.production, atualize também as variáveis no painel da Vercel e faça o redeploy.

Veja mais em: Deploy no Next.js.

## Contato
Me encontre nas redes sociais:
- [LinkedIn](https://linkedin.com/in/robson-monteiro-de-albuquerque-8b3853230)
- [GitHub](https://github.com/robsonalbuquerquedev)
- [Instagram](robson.albuquerque_cm)

---

Projeto acadêmico desenvolvido por Robson Albuquerque.

📧 E-mail: robson.albuquerque.docs@gmail.com












