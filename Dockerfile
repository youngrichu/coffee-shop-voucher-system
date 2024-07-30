FROM node:16

WORKDIR /app

# Copy backend files
COPY backend ./backend

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Copy frontend files
WORKDIR /app
COPY frontend ./frontend

# Install and build frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Set working directory back to root
WORKDIR /app

EXPOSE 3000

CMD ["node", "backend/server.js"]