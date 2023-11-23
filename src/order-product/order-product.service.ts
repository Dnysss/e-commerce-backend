import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProductEntity } from './entities/order-product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderProductService {
    constructor(
        @InjectRepository(OrderProductEntity)
        private readonly oderProductRepository: Repository<OrderProductEntity>,
    ) {}

    async createOrderProduct(productId: number, orderId: number, price: number, amount: number): Promise<OrderProductEntity> {
        return this.oderProductRepository.save({
            amount,
            orderId,
            price,
            productId,
        })
    }
}
