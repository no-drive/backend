FROM node:alpine

# Establece el directorio de trabajo en el directorio actual
WORKDIR ./

# Copia el archivo package.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación al directorio de trabajo
COPY . ./

# Comando por defecto para ejecutar la aplicación
CMD ["node", "index.js"]
