# Etapa 1: Builder
FROM node:22.9.0-alpine3.20 AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e o package-lock.json para o contêiner
COPY package*.json ./

# Instala as dependências do projeto
RUN npm ci

# Copia o restante dos arquivos da aplicação para o contêiner
COPY . .

# Compila o projeto Next.js
RUN npm run build

# Remove as dependências de desenvolvimento para otimizar a imagem final
RUN npm prune --production

# Etapa 2: Runtime
FROM node:22.9.0-alpine3.20 AS runner

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos necessários da fase de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Exponha a porta que será usada pelo servidor Next.js
EXPOSE 3000

# Comando padrão para rodar a aplicação Next.js
CMD ["npm", "start"]
