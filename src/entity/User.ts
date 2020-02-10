import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, JoinTable, OneToMany, Double, Index} from "typeorm";
import {Role} from "./Role"
import * as bcrypt from "bcryptjs";

@Entity({name: "users"})
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    @Index({ unique: true })
    username: string;

    @Column({
        nullable: false
    })
    password: string;

    @Column({
        nullable: false
    })
    name: string;

    @Column({
        nullable: false
    })
    @Index({ unique: true })
    phone: string;

    @Column({
        nullable: false
    })
    @Index({ unique: true })
    email: string;
    
    @ManyToOne(type => Role, role => role.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    role: Role;

    @Column({
        type: 'double',
        nullable: false,
        default: 0,
        unsigned: true
    })
    balance;

    @Column(
        {
            type: 'boolean',
            nullable: false,
            default: true
    })
    status;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    register_date: Date;

    @Column({ type: "datetime", nullable: true, default: null})
    update_date: Date;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
    // @Column({
    //     nullable: false
    // })
    // @OneToOne(type => Role, role => role.id, {nullable: false})
    // @JoinTable({
    //     name: "roles", // table name for the junction table of this relation
    //     joinColumn: {
    //         name: "name",
    //         referencedColumnName: "id"
    //     },
    // })
    
    // role: number;

}
