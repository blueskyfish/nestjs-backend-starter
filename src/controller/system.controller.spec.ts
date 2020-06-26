import { Test, TestingModule } from '@nestjs/testing';
import { SystemController } from './system.controller';
import { SystemService } from '../business/system/system.service';

describe('AppController', () => {
  let appController: SystemController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SystemController],
      providers: [SystemService],
    }).compile();

    appController = app.get<SystemController>(SystemController);
  });

  describe('root', () => {
    it('should return "Hello Susi!"', () => {
      expect(appController.getHello({ name: 'Susi'})).toBe('Hello Susi!');
    });

    it('should return "Hello World!"', () => {
      expect(appController.getHello({ name: null})).toBe('Hello World!');
    });
  });
});
