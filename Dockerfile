FROM node:alpine

# Establecer el directorio de trabajo en el directorio actual
WORKDIR ./

# Limpiar la caché de npm
RUN npm cache clean --force

# Copiar el archivo package.json al directorio de trabajo
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de la aplicación al directorio de trabajo
COPY . ./

# Comando por defecto para ejecutar la aplicación
CMD ["node", "index.js"]
