import {
    Injectable 
} from "@nestjs/common"

@Injectable()
export class AppService {
    getHealth() {
        return {
            ok: true,
            service: "sql-vs-nosql-in-nestjs",
        }
    }
}
