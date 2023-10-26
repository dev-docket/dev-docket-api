import User from 'src/users/user.model';

export class GetAllMembersResponseDto {
  projectId: number;
  userId: number;
  role: string;
  user: User;
}
