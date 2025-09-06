# Prompt Gallery Backend

Prompt Gallery Backend is the server-side application for the Prompt Gallery platform, enabling users to interact with various Large Language Models (LLMs), save, share, and discuss generated responses. This is the MVP version, designed for extensibility and future improvements.

## Features

- Query multiple LLM models and get AI-generated responses
- Save prompts and responses
- Share and discuss responses with other users
- User management and authentication (MVP: basic)
- Organized, scalable codebase following OOP and SOLID principles

## Technical Details

- **Language:** TypeScript (Node.js)
- **Framework:** Express.js
- **Database:** PostgreSQL (via `pg`)
- **Testing:** Jest
- **API Style:** RESTful
- **Architecture:**
  - Controllers: Handle HTTP requests and responses
  - Models: Database access and business logic
  - Services: Transactional logic and orchestration
  - Routes: API endpoint definitions
  - Middlewares: Error handling, validation, authentication
  - Types: TypeScript interfaces and types for strong typing

## Project Structure

```
├── src/
│   ├── app.ts                # Express app entry point
│   ├── controllers/          # Route controllers (business logic)
│   ├── models/               # Database models
│   ├── services/             # Transactional and orchestration services
│   ├── routes/               # API route definitions
│   ├── middlewares/          # Error handling, validation, etc.
│   ├── types/                # TypeScript types/interfaces
│   ├── schemas/              # Validation schemas
│   └── tests/                # Unit and integration tests
├── package.json              # Project metadata and scripts
├── tsconfig.json             # TypeScript configuration
├── Dockerfile                # (TODO) Containerization
└── README.md                 # Project documentation
```

## APIs

### Prompts

- `POST /api/v1/prompts` - Create a new prompt and get LLM response
- `GET /api/v1/prompts` - List all prompts
- `GET /api/v1/prompts/:id` - Get a specific prompt and its response

### Users

- `POST /api/v1/users` - Register a new user
- `GET /api/v1/users` - List all users
- `GET /api/v1/users/:id` - Get user details

### Responses

- `GET /api/v1/responses/:id` - Get a specific response
- (More endpoints planned)

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure your PostgreSQL database in `src/config/database.ts`
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Run tests:
   ```bash
   npm test
   ```

## Tools Used

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Jest
- ESLint

## Future Improvements

- Containerization (Docker)
- Security (authentication, authorization, input validation)
- API documentation (OpenAPI/Swagger)
- Rate limiting, monitoring, logging
- Advanced discussion features
- LLM model management

## Contributing

Pull requests and issues are welcome! Please follow the code style and organization.

## License

MIT
