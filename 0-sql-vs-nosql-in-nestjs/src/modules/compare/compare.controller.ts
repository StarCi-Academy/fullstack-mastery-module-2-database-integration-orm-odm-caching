import {
    Body, Controller, Get, Post 
} from "@nestjs/common"
import {
    CreateCompareDto 
} from "./dto/create-compare.dto"
import {
    CompareService 
} from "./compare.service"

@Controller("compare")
export class CompareController {
    constructor(private readonly compareService: CompareService) {}

  /**
   * Endpoint ghi payload vào cả hai storage để kiểm tra write path.
   * EN: Write endpoint that persists payload to both storages.
   */
  @Post("write")
    write(@Body() dto: CreateCompareDto) {
        return this.compareService.write(dto)
    }

  /**
   * Endpoint đọc dữ liệu từ cả hai storage để đối chiếu kết quả.
   * EN: Read endpoint to compare data returned from both storages.
   */
  @Get("read")
  read() {
      return this.compareService.read()
  }
}
