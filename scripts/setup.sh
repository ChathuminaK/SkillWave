#!/bin/bash

# SkillWave Setup Script
# This script helps set up the SkillWave project environment

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}    SkillWave Project Setup Script      ${NC}"
echo -e "${GREEN}=========================================${NC}"

# Check prerequisites
echo -e "\n${YELLOW}Checking prerequisites...${NC}"

# Check Java
if type -p java > /dev/null; then
    _java=java
elif [[ -n "$JAVA_HOME" ]] && [[ -x "$JAVA_HOME/bin/java" ]]; then
    _java="$JAVA_HOME/bin/java"
else
    echo -e "${RED}Java not found. Please install JDK 11 or higher.${NC}"
    exit 1
fi

java_version=$("$_java" -version 2>&1 | awk -F '"' '/version/ {print $2}')
echo "Java version: $java_version"

# Check Maven
if type -p mvn > /dev/null; then
    echo "Maven installed: $(mvn --version | head -n 1)"
else
    echo -e "${RED}Maven not found. Please install Maven.${NC}"
    exit 1
fi

# Check Node.js
if type -p node > /dev/null; then
    echo "Node version: $(node -v)"
else
    echo -e "${RED}Node.js not found. Please install Node.js 14 or higher.${NC}"
    exit 1
fi

# Check npm
if type -p npm > /dev/null; then
    echo "npm version: $(npm -v)"
else
    echo -e "${RED}npm not found. Please install npm.${NC}"
    exit 1
fi

echo -e "${GREEN}All prerequisites satisfied!${NC}"

# Create project directories if they don't exist
echo -e "\n${YELLOW}Setting up project directories...${NC}"

mkdir -p uploads
echo "Created uploads directory"

# Setup backend
echo -e "\n${YELLOW}Setting up backend...${NC}"
cd backend || { echo "Cannot find backend directory"; exit 1; }

# Create application.properties if it doesn't exist
if [ ! -f "src/main/resources/application.properties" ]; then
    mkdir -p src/main/resources
    echo "Creating application.properties with default settings"
    cat > src/main/resources/application.properties << EOF
spring.application.name=SkillWave
spring.datasource.url=jdbc:h2:file:../skillwavedb;DB_CLOSE_ON_EXIT=FALSE;AUTO_RECONNECT=TRUE
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
app.upload.dir=../uploads
app.jwt.secret=bQeThWmZq4t7w!z%C*F-JaNdRgUkXp2s5u8x/A?D(G+KbPeShVmYq3t6w9z$C&F)J@McQfTjWnZr4u7x!A%D*G-KaPdSgUkXp2s5v8y/B?E(H+MbQeThVmY
app.jwt.expiration=86400000
app.cors.allowed-origins=http://localhost:3000
EOF
fi

# Build backend
echo "Building backend project..."
mvn clean install -DskipTests

cd ..

# Setup frontend
echo -e "\n${YELLOW}Setting up frontend...${NC}"
cd frontend || { echo "Cannot find frontend directory"; exit 1; }

# Create .env file
echo "Creating .env file with default settings"
cat > .env << EOF
REACT_APP_API_URL=http://localhost:8080
REACT_APP_NAME=SkillWave
EOF

# Install dependencies
echo "Installing frontend dependencies..."
npm install

cd ..

echo -e "\n${GREEN}Setup complete!${NC}"
echo -e "${GREEN}-------------------------------------${NC}"
echo -e "${YELLOW}To start the backend:${NC}"
echo -e "  cd backend"
echo -e "  mvn spring-boot:run"
echo -e "${YELLOW}To start the frontend:${NC}"
echo -e "  cd frontend"
echo -e "  npm start"
echo -e "${GREEN}-------------------------------------${NC}"
echo -e "Happy coding!\n"
