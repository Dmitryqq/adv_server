import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name: "statuses"})
export class Status {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    name: string;

}
