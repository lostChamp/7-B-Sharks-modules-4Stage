import { NestFactory } from '@nestjs/core';
import { RoleModule } from './role.module';

async function bootstrap() {
  const app = await NestFactory.create(RoleModule);
  await app.listen(3000);
}
bootstrap();
