# Lightweight Node image for frontend
FROM node:20-alpine

# -------------------------------
# STEP 1: Set working directory
# -------------------------------
WORKDIR /usr/src/app

# -----------------------------------------
# STEP 2: Copy frontend package files first
# -----------------------------------------
COPY package*.json ./

# -------------------------------
# STEP 3: Install dependencies
# -------------------------------
# Includes Vite
RUN npm install

# -------------------------------
# STEP 4: Copy frontend source code
# -------------------------------
COPY . .

# -------------------------------
# STEP 5: Expose Vite dev server port
# -------------------------------
EXPOSE 5173

# -------------------------------
# STEP 6: Start Vite dev server
# -------------------------------
CMD ["npm", "run", "dev"]
