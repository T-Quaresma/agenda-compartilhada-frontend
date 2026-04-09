# agenda-compartilhada-frontend

ShareHub - Frontend

Repositório criado para todo desenvolvimento do frontend do MVP - FullStack Básico.

Interface web para gerenciamento de agendas compartilhadas entre usuários. Permite visualizar atividades, adicionar agendamentos e interagir com outros usuários através de uma SPA (Single Page Application).

---

Tecnologias

HTML5
CSS3
JavaScript (Vanilla)

---

Pré-requisitos

O backend do ShareHub deve estar rodando antes de abrir o frontend.
Repositório do backend: https://github.com/T-Quaresma/agenda-compartilhada-backend

---

Instalação e Execução

1. Clone o repositório:
git clone https://github.com/T-Quaresma/agenda-compartilhada-frontend
cd agenda-compartilhada-frontend

2. Certifique-se que o backend está rodando:
cd agenda-compartilhada-backend
source venv/Scripts/activate
py app.py

3. Abra o frontend:
Abra o arquivo index.html diretamente no navegador.
Não é necessário nenhum servidor local, extensão ou configuração adicional.

---

Funcionalidades

Usuário
- Cadastro de nova conta
- Login com username
- Visualização de dados da conta em Settings
- Logout
- Exclusão de conta

Atividades
- Criação de novas atividades
- Visualização de todas as atividades em cards
- Busca de atividades pelo nome
- Exclusão de atividades

Agendamentos
- Criação de agendamentos vinculados a uma atividade
- Visualização dos agendamentos dentro de cada card de atividade
- Visualização da descrição de cada agendamento
- Exclusão de agendamentos

---

Estrutura do Projeto

agenda-compartilhada-frontend/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── api.js
│   ├── authentication.js
│   ├── activities.js
│   ├── schedules.js
│   ├── participants.js
│   └── app.js
└── README.md