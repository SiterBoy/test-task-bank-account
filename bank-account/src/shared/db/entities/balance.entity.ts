import {Entity, Column, PrimaryGeneratedColumn, VersionColumn} from 'typeorm';

@Entity('balance')
export class BalanceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column( {  default: 0 })
  amount: number;

  @VersionColumn({ default:0 })
  version: number;
}