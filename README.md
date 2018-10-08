# Dashboard

This is a simple dashboard app as a demo for React, Redux and TypeScript running on a Rails backend using Webpacker.
It currently supports adding Twitch, Twitter and HackerNews feeds with a couple of options for each feed (width,
Twitter search query and Twitch feed source).

## Running locally

The app can be launched in development mode locally use foreman:

```bash
foreman start -f Procfile.dev -p 3000
```

## Docker

A production Docker image can be build for running locally or deployment to a cloud hosting service:

```bash
docker build .
docker run -d -p 8080:8080 <id> 
```

## Configuration

To use the Twitch feed functionality you'll need to obtain a [Twitch client ID](https://dev.twitch.tv/dashboard)
and add it to `config/secrets.yml`:

```yaml
twitch_client_id: "your_client_id"
```
