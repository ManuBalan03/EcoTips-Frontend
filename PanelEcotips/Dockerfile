FROM node:20-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias con legacy peer deps si es necesario
RUN npm install --legacy-peer-deps

# Copiar todo
COPY . .

# Puerto según frontend
EXPOSE 5174

# Comando para desarrollo
CMD ["npm", "run", "dev", "--", "--host", "--port", "5174"]
