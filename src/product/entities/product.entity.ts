import { CategoryEntity } from "../../category/entities/category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'product' })
export class ProductEntity {
    @PrimaryGeneratedColumn('rowid')
    id: number;

    @Column({ name: 'name', nullable: false })
    name: string;

    @Column({ name: 'catedory_id', nullable: false})
    categoryId: number;

    @Column({ name: 'price', nullable: false })
    price: number;

    @Column({ name: 'image', nullable: false })
    image: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => CategoryEntity, (category: CategoryEntity) => category.products)
    @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
    category?: CategoryEntity
}