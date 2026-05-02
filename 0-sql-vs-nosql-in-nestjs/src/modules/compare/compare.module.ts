import {
    Module 
} from "@nestjs/common"
import {
    MongooseModule 
} from "@nestjs/mongoose"
import {
    TypeOrmModule 
} from "@nestjs/typeorm"
import {
    CompareController 
} from "./compare.controller"
import {
    CompareService 
} from "./compare.service"
import {
    SqlComparisonItemEntity 
} from "./entities/sql-comparison-item.entity"
import {
    NoSqlComparisonItem,
    NoSqlComparisonItemSchema,
} from "./schemas/nosql-comparison-item.schema"

@Module({
    imports: [
        TypeOrmModule.forFeature([SqlComparisonItemEntity]),
        MongooseModule.forFeature([
            {
                name: NoSqlComparisonItem.name, schema: NoSqlComparisonItemSchema 
            },
        ]),
    ],
    controllers: [CompareController],
    providers: [CompareService],
})
export class CompareModule {}
