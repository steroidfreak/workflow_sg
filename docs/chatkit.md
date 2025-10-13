# Chatkit deployment notes

Chatkit runs as a standalone Next.js service that is bundled with the Workflow SG docker-compose stack.

## Compose service

```yaml
chatkit:
  build:
    context: ./my-chatkit-app
    dockerfile: Dockerfile
  environment:
    - NODE_ENV=production
  expose:
    - "3000"
  networks:
    - workflow
  restart: unless-stopped
```

The container publishes port `3000` inside the shared `workflow` network. Caddy reverse proxies the public domain to this internal service.

## Caddy routing

```caddy
{$CHATKIT_DOMAIN} {
  encode gzip zstd

  header {
    Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    X-Content-Type-Options "nosniff"
    X-Frame-Options "DENY"
    Referrer-Policy "strict-origin-when-cross-origin"
  }

  reverse_proxy chatkit:3000
}
```

Set `CHATKIT_DOMAIN` in the environment (defaults to `chatkit.workflow.sg`). Caddy will obtain TLS certificates and proxy HTTPS requests to the chatkit container.

## Running locally

```bash
# Create the shared network if it does not exist yet
docker network create workflow

# Build and launch the stack
DOMAIN=localhost CHATKIT_DOMAIN=chatkit.localhost docker-compose up --build
```

After the stack starts, open http://chatkit.localhost (or the domain you configured) to access the Next.js workspace.
