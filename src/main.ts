import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { config } from './common/config';
import { ExceptionsFilter } from './common/filters/exception.filter';

export const setupSwagger = (app: INestApplication) => {
  const builder = new DocumentBuilder()
    .setTitle('Simple Calc')
    .setDescription('A simple calculation app')
    .setVersion('1.0')
    .addServer(
      `http://localhost:${config.server.port}`,
      'Example Calc Service API SERVER',
    );
  const document = SwaggerModule.createDocument(app, builder.build(), {
    include: [AppModule],
    deepScanRoutes: true,
  });
  SwaggerModule.setup('/openapi', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ExceptionsFilter());
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
  app.use(bodyParser.raw({ limit: '100mb' }));
  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'.split(','),
    origin: '*',
  });

  setupSwagger(app);
  await app.listen(config.server.port);
}
bootstrap();
