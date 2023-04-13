import {ApiProperty} from "@nestjs/swagger";

export class CreateProfileDto {

    @ApiProperty({example: "Konstantin Kondyurin", description: "ФИО пользователя"})
    readonly full_name: string;

    @ApiProperty({example: "8800553535", description: "Номер телефона пользователя"})
    readonly phone_number: string;
}