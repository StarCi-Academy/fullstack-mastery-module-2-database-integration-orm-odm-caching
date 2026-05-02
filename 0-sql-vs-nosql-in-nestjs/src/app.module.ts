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
    AppController 
} from "./app.controller"
import {
    AppService 
} from "./app.service"
import {
    CompareModule 
} from "./modules/compare/compare.module"
import {
    SqlComparisonItemEntity 
} from "./modules/compare/entities/sql-comparison-item.entity"

@Module({
    imports: [
        // Kết nối PostgreSQL cho nhánh SQL (TypeORM).
        // EN: PostgreSQL connection for SQL branch (TypeORM).
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.PG_HOST ?? "localhost",
            port: Number(process.env.PG_PORT ?? 5432),
            username: process.env.PG_USER ?? "starci_user",
            password: process.env.PG_PASSWORD ?? "starci_password",
            database: process.env.PG_DATABASE ?? "starci_sql_db",
            entities: [SqlComparisonItemEntity],
            synchronize: true,
        }),
        // Kết nối MongoDB cho nhánh NoSQL (Mongoose).
        // EN: MongoDB connection for NoSQL branch (Mongoose).
        MongooseModule.forRoot(
            process.env.MONGO_URI ??
        "mongodb://starci_admin:starci_password@localhost:27017/starci_nosql_db?authSource=admin",
        ),
        CompareModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
