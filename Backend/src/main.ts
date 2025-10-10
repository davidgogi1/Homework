import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('GitHub Search API')
    .setDescription('Auth + GitHub repository search (NestJS)')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, doc);

  // Also expose raw JSON (handy for tooling)
  app.getHttpAdapter().get('/api-json', (_req, res) => res.json(doc));

  const cfg = app.get(ConfigService);

  const port = Number(cfg.get('PORT')) || 5000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(
    `API on http://localhost:${port}  | Docs: http://localhost:${port}/api-docs`,
  );
}
bootstrap();
