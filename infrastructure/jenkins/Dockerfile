FROM jenkins/jenkins:lts
USER root
RUN apt-get update && apt-get install -y docker.io curl unzip \
    && curl -fsSL https://bun.sh/install | bash \
    && mv /root/.bun/bin/bun /usr/local/bin/bun
USER root
