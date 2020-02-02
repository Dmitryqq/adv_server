import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name: "tariffs"})
export class Tariff {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    type: string;

    @Column({
        nullable: false
    })
    description: string;

}
