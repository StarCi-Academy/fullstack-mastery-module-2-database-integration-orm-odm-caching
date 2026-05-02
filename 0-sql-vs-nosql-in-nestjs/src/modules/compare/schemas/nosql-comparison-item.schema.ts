import {
    Prop, Schema, SchemaFactory 
} from "@nestjs/mongoose"
import {
    HydratedDocument 
} from "mongoose"

export type NoSqlComparisonItemDocument = HydratedDocument<NoSqlComparisonItem>;

@Schema({
    collection: "comparison_items", timestamps: true 
})
export class NoSqlComparisonItem {
  @Prop({
      required: true, trim: true 
  })
      title!: string

  @Prop({
      required: true 
  })
      amount!: number

  // Added automatically by Mongoose when timestamps is enabled.
  createdAt?: Date
  updatedAt?: Date
}

export const NoSqlComparisonItemSchema =
  SchemaFactory.createForClass(NoSqlComparisonItem)
