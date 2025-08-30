ARG NODE_VERSION=22.19.0
FROM node:${NODE_VERSION}-alpine
RUN apk update
RUN apk add --no-cache libc6-compat

# Use development node environment by default.
ARG NODE_ENV=development
ENV NODE_ENV ${NODE_ENV}

WORKDIR /app
# Copy the rest of the source files into the image.
COPY . .

RUN npm install
RUN npm run build
# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Run the application as a non-root user.
USER node    


# Expose the port that the application listens on.
EXPOSE 4000
# Run the application.
CMD node src/app.ts