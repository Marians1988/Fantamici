# ==========================================
# STAGE 1: Build dell'applicazione Angular
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Copia i file di dipendenza per sfruttare il caching dei layer di Docker
COPY package*.json ./

# Installazione pulita delle dipendenze
RUN npm ci

# Copia il codice sorgente
COPY . .

# Esegue la build per l'ambiente di produzione
# NOTA: Sostituisci "fantamici-frontend" con il nome del tuo progetto presente in angular.json se diverso
RUN npm run build -- --configuration production

# ==========================================
# STAGE 2: Serve dell'applicazione con Nginx
# ==========================================
FROM nginx:1.25-alpine

# Rimuove la configurazione di default di Nginx
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copia la configurazione personalizzata di Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia i file statici generati dallo Stage 1 nella directory di Nginx
# NOTA: Nelle versioni recenti di Angular (v17+), la build genera i file statici in "dist/<nome-progetto>/browser"
COPY --from=build /app/dist/FantaAmiciFE/browser /usr/share/nginx/html

# Espone la porta 80 del container
EXPOSE 80

# Avvia Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]