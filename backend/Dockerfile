# Use official Node.js 24 image
FROM node:24

# -------------------------------
# STEP 1: Set working directory
# -------------------------------
# All commands will run inside /usr/src/app
WORKDIR /usr/src/app

# -----------------------------------------
# STEP 2: Copy backend package files first
# -----------------------------------------
# This enables Docker layer caching.
# If dependencies don’t change, npm install is skipped.
COPY package*.json ./

# -------------------------------
# STEP 3: Install dependencies
# -------------------------------
RUN npm install

# --------------------------------
# STEP 4: Copy backend source code
# --------------------------------
COPY . .

# -------------------------------
# STEP 5: Expose backend port
# -------------------------------
EXPOSE 4000

# ------------------------------------
# STEP 6: Start backend in dev mode
# ------------------------------------
# Uses nodemon (npm run dev)
CMD ["npm", "run", "dev"]
