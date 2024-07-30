FROM node:14

WORKDIR /app

# Copy backend files
COPY backend ./backend
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy frontend files
COPY frontend ./frontend

# Build frontend
WORKDIR /app/frontend
RUN npm install && npm run build

WORKDIR /app

EXPOSE 3000

CMD ["npm", "start"]