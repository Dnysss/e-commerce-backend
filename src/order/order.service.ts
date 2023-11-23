import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly oderEntity: Repository<OrderEntity>,
        private readonly paymentService: PaymentService
    ) {}

    async createOrder(createOrderDTO: CreateOrderDTO, cartId: number) {
        await this.paymentService.createPayment(createOrderDTO);
        
        return null;
    }
}
