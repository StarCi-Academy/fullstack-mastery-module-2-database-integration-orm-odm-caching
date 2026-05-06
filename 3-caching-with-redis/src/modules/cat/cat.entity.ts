/**
 * Entity TypeORM — thuc the Cat.
 * (EN: TypeORM entity — Cat entity.)
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Cat Entity â€” Thá»±c thá»ƒ minh há»a caching.
 * (EN: Cat Entity for caching demonstration.)
 */
@Entity('cats')
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  breed: string;
}
