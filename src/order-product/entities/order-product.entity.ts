import { OrderEntity } from "src/order/entities/order.entity";
import { ProductEntity } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'order_product' })
export class OrderProductEntity {
    @PrimaryGeneratedColumn('rowid')
    id: number;

    @Column({ name: 'order_id', nullable: false })
    orderId: number;

    @Column({ name: 'product_id', nullable: false })
    productId: number;

    @Column({ name: 'amount', nullable: false })
    amount: number;

    @Column({ name: 'price', nullable: false })
    price: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updateAt: Date;

    @ManyToMany(() => OrderEntity, (order) => order.orderProduct)
    @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
    order?: OrderEntity;

    @ManyToMany(() => ProductEntity, (product) => product.ordersProduct)
    @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
    product?: ProductEntity;
}