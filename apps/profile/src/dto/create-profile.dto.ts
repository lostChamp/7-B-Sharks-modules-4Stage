import {ApiProperty} from "@nestjs/swagger";

export class CreateProfileDto {

    readonly full_name: string;

    readonly phone_number: string;
}