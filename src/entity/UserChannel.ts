import {Entity, JoinColumn, PrimaryGeneratedColumn, ManyToOne, Index} from "typeorm";
import {User} from "./User"
import { Channel } from "./Channel";

@Entity({name: "users_channels"})
@Index(["user", "channel"],{ unique: true })
export class UserChannel {

    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => User, user => user.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    user: User;

    @ManyToOne(() => Channel, channel => channel.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    channel: Channel;
}
