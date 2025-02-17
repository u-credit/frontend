import { API_PATHS } from '@/constants';
import { UpdateUserRequest, User } from '@/Interfaces';

export const updateUser = async (user: UpdateUserRequest): Promise<User> => {
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.user}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(user),
  }).then((res) => res.json());
};
