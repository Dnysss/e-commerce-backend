import { Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export class CartEntity {
    @PrimaryGeneratedColumn('rowid')
    id: number;

    @Column({ name: 'user_id', nullable: false})
    userId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
    
    @CreateDateColumn({ name: 'updated_at' })
    udatedAt: Date;
}