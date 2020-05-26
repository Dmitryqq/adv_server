import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "channels"})
export class Channel {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    name: string;

    @Column({
        nullable: false
    })
    description: string;

    @Column({
        type: "text",
        nullable: false
    })
    logo;

    @Column({
        type: 'double',
        nullable: false,
        default: 0,
        unsigned: true
    })
    balance;

    @Column({
        nullable: false
    })
    max_ads_per_day: number;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    create_date: Date;

    @Column({ type: "datetime", nullable: true, default: null})
    update_date: Date;
}
