import {Entity, JoinColumn, PrimaryGeneratedColumn, ManyToOne, Index, Column} from "typeorm";
import {Tariff} from "./Tariff"
import { Channel } from "./Channel";
import { Advertisement } from "./Advertisement";
import { Status } from "./Status";
import { User } from "./User";

@Entity({name: "adv_channels"})
@Index(["channel", "tariff", "advertisement"],{ unique: true })
export class AdvertisementChannel {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Channel, channel => channel.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    channel: Channel;
    
    @ManyToOne(() => Advertisement, advertisement => advertisement.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    advertisement: Advertisement;

    @ManyToOne(() => Tariff, tariff => tariff.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    tariff: Tariff;

    @Column({
        nullable: false
    })
    dates: string;

    @Column({
        type: 'double',
        nullable: false,
        unsigned: true
    })
    total_price;

    @ManyToOne(() => Status, status => status.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    status: Status;

    @ManyToOne(() => User, user => user.id, {
        nullable: true,
        cascade: true
    })
    @JoinColumn()
    agent: User;
}
