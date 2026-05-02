import {
    IsNotEmpty, IsNumber, IsString 
} from "class-validator"

export class CreateCompareDto {
  @IsString()
  @IsNotEmpty()
      title!: string

  @IsNumber()
      amount!: number
}
