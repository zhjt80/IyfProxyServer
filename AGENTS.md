# IyfServer - Proxy Server

A NestJS proxy server that fetches drama data from iyf.tv and provides RESTful API endpoints for the Iyf mobile application.

## Project Overview

This proxy server acts as an intermediary between IyfApp mobile application and iyf.tv/drama website. It handles:
- Fetching drama listings and details from iyf.tv
- Providing CORS-enabled API endpoints for mobile clients
- Fetching video playback data (media URL) from iyf.tv API
- Handling authentication and session management

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: NestJS (latest stable)
- **Language**: TypeScript
- **HTTP Client**: Axios
- **Data Parsing**: cheerio
- **Validation**: class-validator, class-transformer
- **Logging**: pino
- **Type Safety**: TypeScript with strict mode

## Project Structure

```
iyfserver/
├── src/
│   ├── modules/
│   │   ├── dramas/
│   │   │   ├── dramas.controller.ts
│   │   │   ├── dramas.service.ts
│   │   │   └── dramas.module.ts
│   │   ├── detail/
│   │   │   ├── detail.controller.ts
│   │   │   ├── detail.service.ts
│   │   │   └── detail.module.ts
│   │   ├── getplaydata/
│   │   │   ├── getplaydata.controller.ts
│   │   │   ├── getplaydata.service.ts
│   │   │   └── getplaydata.module.ts
│   │   └── movies/
│   │       ├── movies.controller.ts
│   │       ├── movies.service.ts
│   │       └── movies.module.ts
│   ├── common/
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   └── logging.interceptor.ts
│   │   └── pipes/
│   │       └── validation.pipe.ts
│   ├── services/
│   │   ├── iyf/
│   │   │   ├── iyf.service.ts
│   │   │   └── iyf.module.ts
│   │   ├── logger.service.ts
│   │   └── utils/
│   │       └── generateVV.ts
│   ├── types/
│   │   └── index.ts
│   ├── app.module.ts
│   └── main.ts
├── nest-cli.json
├── tsconfig.json
├── package.json
└── .env
```

## API Endpoints

### GET /api/dramas

List all dramas from iyf.tv.

**File:** `src/modules/dramas/dramas.controller.ts`

**Response:**
```json
{
  "dramas": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "imageUrl": "string",
      "totalEpisodes": number,
      "playCount": number,
      "isHot": boolean,
      "lang": "string",
      "regional": "string",
      "actor": "string",
      "cidMapper": "string",
      "mediaType": "string"
    }
  ]
}
```

**Field Descriptions:**
- `id`: Unique identifier (mediaKey from iyf.tv)
- `title`: Drama/movie title
- `description`: Brief description
- `imageUrl`: Cover image URL
- `totalEpisodes`: Number of episodes (0 for movies)
- `playCount`: Number of views (integer)
- `isHot`: Whether the content is trending/hot (boolean)
- `lang`: Language (e.g., "国语", "韩语")
- `regional`: Region (e.g., "大陆", "韩国")
- `actor`: Comma-separated actor names
- `cidMapper`: Category (e.g., "剧情", "喜剧")
- `mediaType`: Content type ("电视剧" or "电影")

**Controller Example:**
```typescript
@Controller('api/dramas')
export class DramasController {
  constructor(private readonly dramasService: DramasService) {}

  @Get()
  async getDramas() {
    return this.dramasService.findAll();
  }
}
```

### GET /api/detail/:id

Get detailed information about a specific drama including episode list.

**Parameters:**
- `id` (path) - Drama ID

**File:** `src/modules/detail/detail.controller.ts`

**Response:**
```json
{
  "ret": 0,
  "data": {
    "detailInfo": {
      "title": "string",
      "starring": "string",
      "introduce": "string",
      "coverImgUrl": "string",
      "playCount": number,
      "episodes": [
        {
          "episodeId": number,
          "episodeKey": "string",
          "mediaKey": "string",
          "title": "string",
          "episodeTitle": "string",
          "resolutionDes": "string",
          "isVip": boolean
        }
      ]
    }
  }
}
```

**Controller Example:**
```typescript
@Controller('api/detail')
export class DetailController {
  constructor(private readonly detailService: DetailService) {}

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    return this.detailService.findOne(id);
  }
}
```

### GET /api/getplaydata

Get video playback data including media URL for a specific episode.

**Parameters:**
- `mediaKey` (query) - Drama media key
- `videoId` (query) - Video ID
- `videoType` (query, optional) - Video type (default: "1")

**File:** `src/modules/getplaydata/getplaydata.controller.ts`

**Response:**
```json
{
  "episodeId": 1207177,
  "episodeKey": "8nthjJkg0VA",
  "mediaKey": "yWFaVzMB6wF",
  "mediaUrl": "https://...",
  "episodeTitle": "01",
  "resolutionDes": "576P",
  "title": "剧集标题",
  "videoType": 1,
  "isVip": false,
  ...
}
```

**Controller Example:**
```typescript
@Controller('api/getplaydata')
export class GetPlaydataController {
  constructor(private readonly getPlaydataService: GetPlaydataService) {}

  @Get()
  async getPlaydata(
    @Query('mediaKey') mediaKey: string,
    @Query('videoId') videoId: string,
    @Query('videoType') videoType?: string,
  ) {
    return this.getPlaydataService.getPlaydata(mediaKey, videoId, videoType);
  }
}
```

### GET /api/movies

List all movies from iyf.tv.

**File:** `src/modules/movies/movies.controller.ts`

**Response:**
```json
{
  "movies": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "imageUrl": "string",
      "totalEpisodes": 0,
      "playCount": number,
      "isHot": boolean,
      "lang": "string",
      "regional": "string",
      "actor": "string",
      "cidMapper": "string",
      "mediaType": "string"
    }
  ]
}
```

**Field Descriptions:** (Same as /api/dramas endpoint)
- `id`: Unique identifier (mediaKey from iyf.tv)
- `title`: Drama/movie title
- `description`: Brief description
- `imageUrl`: Cover image URL
- `totalEpisodes`: Number of episodes (always 0 for movies)
- `playCount`: Number of views (integer)
- `isHot`: Whether the content is trending/hot (boolean)
- `lang`: Language (e.g., "国语", "韩语")
- `regional`: Region (e.g., "大陆", "韩国")
- `actor`: Comma-separated actor names
- `cidMapper`: Category (e.g., "剧情", "喜剧")
- `mediaType`: Content type ("电视剧" or "电影")

**Controller Example:**
```typescript
@Controller('api/movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getMovies() {
    return this.moviesService.findAll();
  }
}
```

## Source Data

The server fetches data from iyf.tv API endpoints:

- **Dramas List**: `https://m10.iyf.tv/api/list/Search`
- **Drama Detail**: `https://api.iyf.tv/api/video/videodetails`
- **Video Playdata**: `https://api.iyf.tv/api/video/getplaydata`

## Setup Instructions

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

```bash
cd IyfServer
npm install
```

Or create a new NestJS project:
```bash
npx @nestjs/cli new .
npm install @nestjs/config @nestjs/throttler axios cheerio class-validator class-transformer pino pino-pretty
```

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
IYF_BASE_URL=https://www.iyf.tv
```

### Running the Server

**Development mode:**
```bash
npm run start:dev
```

**Production build:**
```bash
npm run build
npm run start:prod
```

**Watch mode:**
```bash
npm run start:debug
```

The server will start on `http://localhost:3000`

## Implementation Details

### CORS Configuration

Configure CORS in `src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://10.0.2.2:3000', 'http://localhost:3000', 'exp://localhost:8081'],
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  });
  await app.listen(3000);
}
bootstrap();
```

### Global Validation Pipe

Enable global validation in `src/main.ts`:

```typescript
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  })
);
```

### Data Parsing

The iyf.tv website likely returns HTML or JSON data that needs to be parsed. Common approaches:
- **HTML parsing**: Use cheerio to parse HTML responses
- **JSON parsing**: Parse JSON responses directly
- **Regex**: Extract data from HTML using regular expressions

### DTO Examples

Create DTOs for request validation:

```typescript
// src/modules/detail/dto/get-detail.dto.ts
import { IsString } from 'class-validator';

export class GetDetailDto {
  @IsString()
  id: string;
}
```

### Service Structure

Example service implementation:

```typescript
// src/modules/dramas/dramas.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { IyfService } from '../../services/iyf.service';

@Injectable()
export class DramasService {
  private readonly logger = new Logger(DramasService.name);

  constructor(private readonly iyfService: IyfService) {}

  async findAll() {
    this.logger.log('Fetching all dramas');
    return this.iyfService.fetchDramas();
  }
}
```

### Module Structure

Example module configuration:

```typescript
// src/modules/dramas/dramas.module.ts
import { Module } from '@nestjs/common';
import { DramasController } from './dramas.controller';
import { DramasService } from './dramas.service';
import { IyfModule } from '../../services/iyf.module';

@Module({
  imports: [IyfModule],
  controllers: [DramasController],
  providers: [DramasService],
  exports: [DramasService],
})
export class DramasModule {}
```

### Logging with Pino

Integrate Pino for structured logging:

```typescript
// src/services/logger.service.ts
import { Injectable, LoggerService, Scope } from '@nestjs/common';
import pino from 'pino';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements LoggerService {
  private readonly logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  });

  log(message: any, context?: string) {
    this.logger.info({ context }, message);
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error({ context, trace }, message);
  }

  warn(message: any, context?: string) {
    this.logger.warn({ context }, message);
  }

  debug(message: any, context?: string) {
    this.logger.debug({ context }, message);
  }
}
```

### Configuration Module

Use NestJS ConfigModule:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    // other modules
  ],
})
export class AppModule {}
```

### Error Handling

Create custom exception filter:

```typescript
// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    response.status(status).json(message);
  }
}
```

Apply globally in `main.ts`:

```typescript
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

app.useGlobalFilters(new HttpExceptionFilter());
```

### Rate Limiting

Add rate limiting with @nestjs/throttler:

```typescript
// src/app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
  ],
})
export class AppModule {}
```

Use in controllers:

```typescript
@Throttle(10, 60)
@Get()
async getDramas() {}
```

## Development Guidelines

### Code Standards

- Use NestJS decorators (@Controller, @Get, @Post, @Injectable)
- Use Dependency Injection for services
- Implement DTOs for request validation
- Use async/await for asynchronous operations
- Follow SOLID principles
- Add input validation with class-validator

### Testing

```bash
npm run test
npm run test:e2e
npm run test:cov
```

Create tests for:
- Controllers (`src/modules/**/*.controller.spec.ts`)
- Services (`src/modules/**/*.service.spec.ts`)
- Data parsing logic
- Error handling
- Edge cases

Testing frameworks:
- Jest (NestJS default)
- `@nestjs/testing` for unit tests
- Supertest for e2e tests

Example test:

```typescript
describe('DramasController', () => {
  let controller: DramasController;
  let service: DramasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DramasController],
      providers: [DramasService],
    }).compile();

    controller = module.get<DramasController>(DramasController);
    service = module.get<DramasService>(DramasService);
  });

  it('should return array of dramas', async () => {
    const result = await controller.getDramas();
    expect(result).toBeInstanceOf(Array);
  });
});
```

### TypeScript Types

Define types in `src/types/index.ts`:

```typescript
export interface Drama {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  totalEpisodes: number;
}

export interface Episode {
  episodeId: number;
  episodeKey: string;
  mediaKey: string;
  title: string;
  episodeTitle: string;
  resolutionDes: string;
  videoType: number;
  isVip: boolean;
}

export interface DramaDetail {
  ret: number;
  data: {
    detailInfo: {
      title: string;
      starring: string;
      introduce: string;
      coverImgUrl: string;
      playCount: number;
      episodes: Episode[];
    };
  };
}
```

### NestJS CLI

Useful CLI commands:

```bash
# Generate module
nest g module dramas

# Generate controller
nest g controller dramas

# Generate service
nest g service dramas

# Generate DTO (manual creation recommended)
```

## Mobile App Integration

The IyfApp mobile application connects to this server using:
```
http://10.0.2.2:3000/api
```

For iOS simulator, use:
```
http://localhost:3000/api
```

The mobile app uses these endpoints:
- `/api/dramas` - Browse drama listings
- `/api/detail/:id` - View drama details and episodes
- `/api/getplaydata` - Get video media URL for playback

For development with different origins, ensure CORS is properly configured in `src/main.ts`.

## Security Considerations

- Hide the source website URL from clients
- Implement rate limiting to prevent abuse
- Sanitize all user inputs with class-validator
- Use HTTPS in production
- Keep dependencies updated
- Don't expose sensitive data in error messages
- Use environment variables for configuration
- Implement proper error handling filters

## Troubleshooting

### Common Issues

**CORS errors:**
- Ensure CORS is enabled in `src/main.ts`
- Check allowed origins in CORS configuration

**Validation errors:**
- Ensure DTOs are properly decorated with class-validator decorators
- Check if ValidationPipe is enabled globally

**Module resolution errors:**
- Ensure all modules are properly imported in `app.module.ts`
- Check circular dependencies

**Timeout errors:**
- Increase timeout duration for external requests
- Implement retry logic in service layer

**Data parsing failures:**
- The source website structure may have changed
- Update parsing logic to match new structure

### Debugging

Enable debug logging:
```env
LOG_LEVEL=debug
```

Check server logs for detailed error messages.

## Future Enhancements

- Add caching layer with NestJS cache module + Redis
- Implement database integration (Prisma/TypeORM) when needed
- Add authentication with NestJS Passport/JWT strategies
- Implement watch history synchronization
- Add search functionality with full-text search
- Support for additional regions/categories
- Real-time updates using WebSockets with @nestjs/websockets
- Add GraphQL API with @nestjs/graphql
- Add API documentation with @nestjs/swagger
- Implement microservices architecture
- Add health checks with @nestjs/terminus
- Implement request/response logging interceptor

## Deployment

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
```

Build and run:

```bash
docker build -t iyf-server .
docker run -p 3000:3000 iyf-server
```

### Cloud Deployment

**Railway** (Recommended for NestJS):
- Connect your GitHub repository
- Railway automatically detects NestJS
- Simple configuration

**Other platforms:**
- **Heroku** - Works well with NestJS
- **AWS** - EC2, ECS, Lambda, App Runner
- **Google Cloud Run** - Container-based deployment
- **DigitalOcean App Platform** - Easy deployment
- **Render** - Free tier available
- **Fly.io** - Global edge deployment

### Production Checklist

- Set `NODE_ENV=production`
- Enable all validation
- Use HTTPS
- Implement proper logging
- Set up monitoring
- Configure rate limiting
- Use environment variables for secrets
- Enable health check endpoints
- Set up CI/CD pipeline

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the code standards
4. Add tests if applicable
5. Ensure tests pass (`npm run test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

[Add your license here]
