import { Test, TestingModule } from '@nestjs/testing';
import { PrintJobController } from './print-job.controller';
import { PrintJobService } from './print-job.service';

describe('PrintJobController', () => {
  let controller: PrintJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrintJobController],
      providers: [PrintJobService],
    }).compile();

    controller = module.get<PrintJobController>(PrintJobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
