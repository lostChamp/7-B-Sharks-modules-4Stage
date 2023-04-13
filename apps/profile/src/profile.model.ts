import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../../user/src/users.model";


interface ProfileCreationAttribute {
    full_name: string,
    phone_number: string
}
@Table({tableName: "profile"})
export class Profile extends Model<Profile, ProfileCreationAttribute> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: true})
    full_name: string;

    @Column({type: DataType.STRING, allowNull: true})
    phone_number: string;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    user_id: number

    @BelongsTo(() => User)
    user: User
}