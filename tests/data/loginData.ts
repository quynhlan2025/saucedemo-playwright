export interface LoginTestData {
  description: string;
  username: string;
  password: string;
  expectedUrl?: string;    // có thể có hoặc không — dùng khi login thành công
  expectedMessage?: string; // có thể có hoặc không — dùng khi login thất bại
}

export const loginData: LoginTestData[] = [
  {
    description: 'Login thành công với standard_user',
    username: 'standard_user',
    password: 'secret_sauce',
    expectedUrl: 'inventory',
  },
  {
    description: 'Login thất bại với locked_out_user',
    username: 'locked_out_user',
    password: 'secret_sauce',
    expectedMessage: 'Sorry, this user has been locked out.',
  },
  {
    description: 'Login thất bại với sai username và password',
    username: 'bad_user',
    password: 'bad_pass',
    expectedMessage: 'Username and password do not match any user in this service',
  },
  {
    description: 'Login thất bại khi để trống username',
    username: '',
    password: 'secret_sauce',
    expectedMessage: 'Username is required',
  },
  {
    description: 'Login thất bại khi để trống password',
    username: 'standard_user',
    password: '',
    expectedMessage: 'Password is required',
  },
  {
    description: 'Login thành công với problem_user',
    username: 'problem_user',
    password: 'secret_sauce',
    expectedUrl: 'inventory',
  },
  {
    description: 'Login thành công với performance_glitch_user',
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    expectedUrl: 'inventory',
  },
];
