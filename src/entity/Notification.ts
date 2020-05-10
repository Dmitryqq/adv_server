import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { User } from "./User";
import { NotificationType } from "./NotificationType";

@Entity({name: "notifications"})
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    notification_text: string;

    @ManyToOne(type => User, user => user.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    user: User;

    @ManyToOne(type => NotificationType, type => type.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    type: NotificationType;
}
