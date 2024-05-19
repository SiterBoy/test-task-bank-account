import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { BalanceEntity } from '../../shared/db/entities/balance.entity';

@Injectable()
export class AccountBalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private balanceRepository: Repository<BalanceEntity>,
    private entityManager: EntityManager
  ) {}

  async getBalance(id: number): Promise<BalanceEntity> {
    return this.balanceRepository.findOne({ where: { id } });
  }

  async updateBalanceWithLock(id: number, amount: number, expectedVersion: number): Promise<void> {
    await this.entityManager.transaction(async manager => {
      const balance = await this.balanceRepository.findOne( { where: { id } });

      if (!balance) {
        throw new Error('Balance not found');
      }

      if (balance.version !== expectedVersion) {
        throw new Error('Balance has been updated');
      }

      // Here can be different balance conditions

      balance.amount += amount;
      balance.version += 1;

      await manager.save(balance);
    });
  }
}