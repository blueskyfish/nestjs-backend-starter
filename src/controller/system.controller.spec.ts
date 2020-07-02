import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestingLogger } from '@nestjs/testing/services/testing-logger.service';
import { SettingConfig } from '../common/setting/setting.config';
import { SettingService } from '../common/setting/setting.service';
import { SystemController } from './system.controller';
import { AliveService, SystemService } from '../business/system';

describe('AppController', () => {

  let app: TestingModule = null;
  let appController: SystemController;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [SystemController],
      providers: [
        {
          provide: SettingConfig,
          useValue: new SettingConfig({
            appHome: process.cwd()
          })
        },
        Logger,
        SystemService,
        SettingService,
        AliveService
      ],
    }).compile();

    app.useLogger(TestingLogger);

    appController = app.get<SystemController>(SystemController);
  });

  afterAll(async () => await app.close());

  describe('root', () => {
    it('should return "Hello Susi!"', () => {
      expect(appController.getHello({ name: 'Susi'})).toBe('Hello Susi!');
    });

    it('should return "Hello World!"', () => {
      expect(appController.getHello({ name: null})).toBe('Hello World!');
    });
  });
});
