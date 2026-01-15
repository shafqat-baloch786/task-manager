FROM node:24

WORKDIR /usr/src/app

# Copy root package.json into container
COPY package*.json ./

# Install dependencies (from root package.json)
RUN npm install

# Copy backend source code only
COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]
