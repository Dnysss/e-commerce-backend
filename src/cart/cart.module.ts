import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartEntity } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity])],
  providers: [CartService],
  controllers: [CartController]
})
export class CartModule {}
