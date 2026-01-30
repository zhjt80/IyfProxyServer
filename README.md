# IyfServer - Proxy Server

NestJS proxy server for fetching drama data from iyf.tv.

## Installation

```bash
npm install
```

## Running the application

```bash
# development
npm run start:dev

# production mode
npm run build
npm run start:prod
```

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
IYF_BASE_URL=https://www.iyf.tv
```

## API Endpoints

- `GET /api/dramas` - List all dramas
- `GET /api/detail/:id` - Get drama details and episodes
- `GET /api/stream/:episodeKey` - Get video stream URL

## Features

- NestJS framework with TypeScript
- Pino logging
- Class-validator for request validation
- CORS enabled for mobile app
- Rate limiting
- Global exception handling
- Request/response logging
- Timeout handling

## License

MIT
