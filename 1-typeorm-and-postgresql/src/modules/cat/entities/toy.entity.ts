/**
 * Entity TypeORM — thuc the Cat.
 * (EN: TypeORM entity — Cat entity.)
 */
import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne 
} from "typeorm"
import {
    Cat 
} from "./cat.entity"

/**
 * Toy Entity â€” Äáº¡i diá»‡n cho Ä‘á»“ chÆ¡i cá»§a mÃ¨o.
 * Nhiá»u Ä‘á»“ chÆ¡i cÃ³ thá»ƒ thuá»™c vá» cÃ¹ng má»™t con mÃ¨o (N:1).
 * (EN: Represents a cat's toy. Many toys can belong to the same cat (N:1).)
 */
@Entity("toys")
export class Toy {
  /**
   * ID tá»± tÄƒng.
   * (EN: Auto-incremented ID.)
   */
  @PrimaryGeneratedColumn()
      id: number

  /**
   * TÃªn Ä‘á»“ chÆ¡i.
   * (EN: Name of the toy.)
   */
  @Column()
      name: string

  /**
   * Quan há»‡ N:1 vá»›i Cat.
   * (EN: N:1 relationship with Cat.)
   */
  @ManyToOne(() => Cat,
      (cat) => cat.toys)
      cat: Cat
}
