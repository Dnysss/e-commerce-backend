import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance } from "typeorm";

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
}