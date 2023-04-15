import {BelongsToMany, Column, DataType, HasOne, Model, Table} from "sequelize-typescript";
import {Role} from "../../role/src/roles.model";
import {UserRoles} from "../../role/src/user-roles.model";
import {Profile} from "./profile.model";
interface UserCreationAttribute {
    mail: string,
    password: string
}
@Table({tableName: "user"})
export class User extends Model<User, UserCreationAttribute> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: true})
    mail: string;

    @Column({type: DataType.STRING, allowNull: true})
    password: string;

    @HasOne(() => Profile)
    profile: Profile;

    // @BelongsToMany(() => Role, () => UserRoles)
    // roles: Role[];
}