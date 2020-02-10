import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index} from "typeorm";
import { AdvertisementChannel } from "./AdvertisementChannel";

@Entity({name: "adv_channel_date"})
@Index(["date", "advertisementchannel"],{ unique: true })
export class AdvertisementDate {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'date',
        nullable: false
    })
    date;

    @ManyToOne(() => AdvertisementChannel, advertisementchannel => advertisementchannel.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    advertisementchannel: AdvertisementChannel;
}
