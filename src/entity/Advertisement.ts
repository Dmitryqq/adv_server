import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { User } from "./User";

@Entity({name: "advertisements"})
export class Advertisement {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    adv_text: string;

    @ManyToOne(type => User, user => user.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    user: User;

}
