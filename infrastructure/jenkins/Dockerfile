FROM jenkins/jenkins:lts
USER root
# Install Docker CLI and Bun
RUN apt-get update && apt-get install -y docker.io curl unzip \
    && curl -fsSL https://bun.sh/install | bash \
    && mv /root/.bun/bin/bun /usr/local/bin/bun
# We stay as root to ensure we can access the docker socket
USER root
