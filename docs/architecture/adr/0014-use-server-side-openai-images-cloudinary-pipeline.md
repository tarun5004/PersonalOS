# ADR-0014: Use Server-Side OpenAI Images and Cloudinary Asset Pipeline

## Context

PersonalOS needs generated avatar, dashboard background, badge, and achievement artwork. Cloudinary is already introduced as the durable image storage and optimized delivery layer. OpenAI Images API is requested for image generation.

OpenAI and Cloudinary credentials are sensitive and must not be exposed to browser JavaScript or committed to the repository.

## Decision

Use a server-side image asset pipeline:

1. Frontend submits an image-generation request through a documented backend endpoint.
2. Backend validates prompt, image type, user ownership, and rate limits.
3. Backend calls OpenAI image generation using server-side credentials.
4. Backend uploads generated image output to Cloudinary using server-side credentials.
5. Backend stores and returns Cloudinary delivery URL/public ID metadata.
6. Frontend renders only optimized Cloudinary URLs.

OpenAI API keys and Cloudinary API secrets must remain backend-only environment variables.

## Alternatives Considered

- Call OpenAI directly from the frontend.
- Upload generated images directly from the frontend with signed Cloudinary credentials.
- Store generated images in MongoDB.
- Skip AI-generated assets and use static illustrations only.

## Consequences

The asset pipeline protects secrets and gives the app durable, optimized image URLs.

The backend must handle cost, latency, prompt validation, abuse prevention, and error states.

Image generation must be optional and must not block core task, habit, auth, dashboard, or analytics workflows.

## Status

Accepted for the Next-Level OS implementation track.
