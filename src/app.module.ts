import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { NatsModule } from './transports/nats.module';
import { HealthCheckModule } from './health-check/health-check.module';

@Module({
  imports: [ProductsModule, OrdersModule, NatsModule, HealthCheckModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
