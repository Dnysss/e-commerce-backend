import { OrderEntity } from "src/order/entities/order.entity";
import { PaymentStatusEntity } from "src/payment-status/entities/payment-status.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, TableInheritance } from "typeorm";

@Entity({ name: 'payment' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class PaymentEntity {
    @PrimaryGeneratedColumn('rowid')
    id: number;

    @Column({ name: 'status_id', nullable: false })
    statusId: number;

    @Column({ name: 'pice', nullable: false })
    price: number;

    @Column({ name: 'discount', nullable: false })
    discount: number;

    @Column({ name: 'final_price', nullable: false})
    finalPrice: number;

    @Column({ name: 'type', nullable: false })
    type: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updateAt: Date;

    @OneToMany(() => OrderEntity, (order) => order.payment)
    orders?: OrderEntity[];

    @ManyToOne(() => PaymentStatusEntity, (payments) => payments)
    @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
    paymentStatus?: PaymentStatusEntity;
}