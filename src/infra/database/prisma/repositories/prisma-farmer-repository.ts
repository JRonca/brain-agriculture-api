import { Farmer } from '@domain/entities/farmer';
import { FarmersRepository } from '@domain/repositories/farmer-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaFarmerMapper } from '../mappers/prisma-farmer-mapper';
import { PaginationParams } from '@core/repositories/pagination-params';

@Injectable()
export class PrismaFarmersRepository implements FarmersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list({ page, limit }: PaginationParams): Promise<Farmer[]> {
    const farmers = await this.prisma.farmer.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
    });
    return farmers.map((farmer) => {
      return PrismaFarmerMapper.toDomain(farmer);
    });
  }

  async findById(id: string): Promise<Farmer | null> {
    const farmer = await this.prisma.farmer.findUnique({
      where: {
        id: id,
      },
    });

    if (!farmer) {
      return null;
    }

    return PrismaFarmerMapper.toDomain(farmer);
  }

  async findByDocument(document: string): Promise<Farmer | null> {
    const farmer = await this.prisma.farmer.findUnique({
      where: {
        document,
      },
    });

    if (!farmer) {
      return null;
    }

    return PrismaFarmerMapper.toDomain(farmer);
  }

  async create(farmer: Farmer): Promise<Farmer> {
    const raw = PrismaFarmerMapper.toPrisma(farmer);

    const createdFarmer = await this.prisma.farmer.create({
      data: raw,
    });

    return PrismaFarmerMapper.toDomain(createdFarmer);
  }

  async update(farmer: Farmer): Promise<Farmer> {
    const raw = PrismaFarmerMapper.toPrisma(farmer);

    const updatedFarmer = await this.prisma.farmer.update({
      where: {
        id: farmer.id.toString(),
      },
      data: raw,
    });

    return PrismaFarmerMapper.toDomain(updatedFarmer);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.farmer.delete({
      where: {
        id: id,
      },
    });
  }
}
