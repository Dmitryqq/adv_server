import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index} from "typeorm";
import { Advertisement } from "./Advertisement";

@Entity({name: "adv_date"})
@Index(["date", "advertisement"],{ unique: true })
export class AdvertisementDate {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'date',
        nullable: false
    })
    date;

    @ManyToOne(() => Advertisement, advertisement => advertisement.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    advertisement: Advertisement;
}
