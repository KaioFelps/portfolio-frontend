DISPLAY_NAME=Portfólio [frontend]
DESCRIPTION=Front-end do meu portfólio/blog
MAIN=build/index.js
MEMORY=1000
SUBDOMAIN=portfolio-frontend
VERSION=recommended
AUTORESTART=true
START=npm i && npm run build && node -r dotenv/config build