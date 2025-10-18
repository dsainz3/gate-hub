FROM mcr.microsoft.com/devcontainers/python:3.11

# Install additional OS packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        openssh-client \
        bash-completion \
        curl \
        git \
        jq \
        nano && \
    rm -rf /var/lib/apt/lists/*

# Install poetry via pipx to keep it isolated
RUN pipx install poetry && pipx ensurepath

# Set up shell profile directory for customizations
COPY .devcontainer/profile.d/ /etc/profile.d/

# Provide a helper script for HAOS SSH access
COPY .devcontainer/haos-ssh /usr/local/bin/haos-ssh
RUN chmod +x /usr/local/bin/haos-ssh
