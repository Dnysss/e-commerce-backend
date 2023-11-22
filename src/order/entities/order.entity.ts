import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'order'})
export class OrderEntity {
    @PrimaryGeneratedColumn('rowid')
    id: number;

    @Column({ name: 'user_id', nullable: false })
    userId: number;

    @Column({ name: 'address_id', nullable: false })
    addressId: number;

    @Column({ name: 'date', nullable: false })
    date: Date;

    @Column({ name: 'payment_id', nullable: false })
    paymentId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updateAt: Date;
}