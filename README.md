# Kaio Felps: site pessoal
Este é o repositório do meu site pessoal: um blog + showcase de projetos realizados
(aka portfólio). O website está sendo desenvolvido utilizando [svelte-kit](https://kit.svelte.dev/).
Neste repositório está o código front-end do site. O código do servidor está no repositorio
[portfolio-backend](https://github.com/KaioFelps/portfolio-backend).

## Requisitos funcionais
### Navegação de usuários
- [x] Visualizar a home (/)
- [ ] Visualizar a aba sobre mim (/sobre)
- [x] Visualizar a aba de blog (/blog)
    - [x] Pesquisar posts por tag e por título
- [x] Visualizar um post do blog (/blog/:slug)
- [x] Visualizar a aba de projetos (/projetos)
    - [x] Pesquisar projetos por tag e por título

### Navegação de administradores; editores
- [x] Fazer login no painel administrativo
- [x] Deslogar do painel administrativo
- [x] Criar um novo projeto
- [x] Editar um projeto
- [x] Apagar um projeto
- [x] Criar uma nova tag
- [x] Editar uma tag
- [ ] Apagar uma tag
- [ ] Criar um novo post
- [ ] Editar um post
- [ ] Apagar um post
- [ ] Criar um novo usuário
- [ ] Editar um usuário
- [ ] Apagar um usuário

### Funcionalidades
- Visualizar registros de ações CRUD dos domínios (no painel administrativo)
- Filtrar projetos e posts (tanto no site quanto no painel administrativo)
- Referenciar links através dos projetos
- Alternar entre modo claro e escuro na interface
- Navegar pelo site em dispositivos móveis (celulares, tablets)

## Rodando o site
Tutoriais para rodar o site em diferentes ambientes

### Desenvolvimento
1. Fazer o fork/download deste repositório
2. Criar um arquivo `.env` na raíz do projeto com o conteúdo do arquivo `.env.example` (preenchido corretamente)
|   Chave   |   Fim |
|   :---    |   :-- |
|   BACKEND_URL   |   URL da api back-end para qual esta aplicação fará as requisições    |
|   PUBLIC_THEME_COOKIE_KEY |   Chave que será usada para armazenar/ler o cookie que guarda a opção de tema do usuário (claro ou escuro)    |
3. Rode os comandos abaixo no terminal para iniciar o servidor
```bash
npm run dev --open
```

### Produção
Dependendo de onde for hospedado (mais especificamente, do nível de suporte ao framework ofertado pela host),
os comandos podem mudar. Na hospedagem da Square Cloud, este é o comando de start:
```bash
npm run squarecloud
# npm i && shx rm -rf .svelte-kit & npm run build & node -r dotenv/config build # se for no windows
# ou
# npm i && shx rm -rf ./.svelte-kit ; npm run build ; node -r dotenv/config build # se for em qualquer outro OS
# os comandos farão o seguinte procedimento:
#   instala as dependências;
#   apaga o diretório .svelte-kit para não atrapalhar o próximo build
#   roda o build pra gerar o novo diretório .svelte-kit atualizado
#   roda o arquivo build/index.js com Node.js, fazendo o require (import + execução síncrona) do pacote dotenv/config
```

O adapter usado para hospedagem na Square Cloud é o Node.js adapter. Veja
as [opções de adaptadores para produção do svelte](https://kit.svelte.dev/docs/adapters).