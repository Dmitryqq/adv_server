import {Entity, JoinColumn, PrimaryGeneratedColumn, ManyToOne, Index, Column} from "typeorm";
import {Tariff} from "./Tariff"
import { Channel } from "./Channel";

@Entity({name: "channels_tariffs"})
@Index(["channel", "tariff"],{ unique: true })
export class ChannelTariff {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Channel, channel => channel.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    channel: Channel;
    
    @ManyToOne(() => Tariff, tariff => tariff.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    tariff: Tariff;

    @Column({
        type: 'double',
        nullable: false,
        unsigned: true
    })
    price;
}
