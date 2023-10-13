import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('API title')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 1000, // limit each IP to 100 requests per window
    keyGenerator: function (req) {
      return req.connection.remoteAddress; // use the remote address as the key
    },
  });

  app.use(limiter);

  app.useGlobalPipes(new ValidationPipe());

  // app.enableCors({
  //   origin: ['https://dev-docket.vercel.app/', 'http://127.0.0.1:5173'], // adjust this to match the domain you are calling from
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });

  app.use((request: Request, response: Response, next: NextFunction) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });

  await app.listen(3000);
}
bootstrap();
