From node:hydrogen-alpine3.19

# Establecer el directorio de trabajo en el directorio actual
WORKDIR ./

# Copiar el archivo package.json al directorio de trabajo
COPY package*.json ./

# Copiar el resto de la aplicación al directorio de trabajo
COPY . ./

# Comando por defecto para ejecutar la aplicación
CMD ["node", "index.js"]
