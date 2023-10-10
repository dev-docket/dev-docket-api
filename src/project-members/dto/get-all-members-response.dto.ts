import User from 'src/user/user.model';

export class GetAllMembersResponseDto {
  projectId: number;
  userId: number;
  role: string;
  user: User;
}
