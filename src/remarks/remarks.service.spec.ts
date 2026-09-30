import { Test, TestingModule } from '@nestjs/testing';
import { RemarksService } from './remarks.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RemarksService', () => {
  let service: RemarksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemarksService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RemarksService>(RemarksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});