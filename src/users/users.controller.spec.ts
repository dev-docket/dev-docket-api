import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { Response } from 'express';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            updateProfileCompletionStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateProfile', () => {
    it('should return a success message for valid input', async () => {
      const completeProfileDto = new CompleteProfileDto();
      completeProfileDto.user = { id: 1, username: 'testuser' };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest
        .spyOn(service, 'updateProfileCompletionStatus')
        .mockResolvedValue(undefined);
      await controller.updateProfileCompletionStatus(
        completeProfileDto,
        mockResponse,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Profile completion status updated successfully',
      });
    });

    it('should throw an error for invalid input', async () => {
      const completeProfileDto = new CompleteProfileDto(); // Missing required fields
      const mockResponse = {} as Response;

      await expect(
        controller.updateProfileCompletionStatus(
          completeProfileDto,
          mockResponse,
        ),
      ).rejects.toThrow();
    });

    it('should handle service errors', async () => {
      const completeProfileDto = new CompleteProfileDto();
      completeProfileDto.user = { id: 1, username: 'testuser' };
      const mockResponse = {} as Response;

      jest
        .spyOn(service, 'updateProfileCompletionStatus')
        .mockRejectedValue(new Error('Service error'));

      await expect(
        controller.updateProfileCompletionStatus(
          completeProfileDto,
          mockResponse,
        ),
      ).rejects.toThrow('Service error');
    });
  });
});
