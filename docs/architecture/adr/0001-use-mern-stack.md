# ADR-0001: Use MERN Stack

## Context

Personal OS V1 targets a primary developer skill set of React, JavaScript, Node.js, Express.js, and MongoDB.

The project needs a familiar, open-source-friendly stack that supports a self-hostable productivity dashboard without overengineering V1.

## Decision

Use the MERN stack for V1:

- MongoDB
- Express.js
- React
- Node.js

Mongoose will be used for MongoDB modeling.

## Alternatives considered

- PostgreSQL with an ORM
- Next.js full-stack app
- Firebase or hosted backend-as-a-service
- Microservices

## Consequences

This keeps the project aligned with the developer's strengths and makes the codebase easier to learn for JavaScript contributors.

MongoDB requires careful schema discipline, documented indexes, and service-level ownership checks.

## Status

Accepted for V1.

