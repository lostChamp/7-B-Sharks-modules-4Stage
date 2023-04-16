import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {UserRoles} from "./user-roles.model";
import {User} from "./users.model";

interface RoleCreationAttribute {
    value: string,
    description: string
}
@Table({tableName: "roles"})
export class Role extends Model<Role, RoleCreationAttribute> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: true})
    value: string;

    @Column({type: DataType.STRING, allowNull: true})
    description: string;

    @BelongsToMany(() => User, () => UserRoles)
    users: User[];
}