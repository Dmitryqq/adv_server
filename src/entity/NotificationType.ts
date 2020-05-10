import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name: "notification_types"})
export class NotificationType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    type: string;
}
