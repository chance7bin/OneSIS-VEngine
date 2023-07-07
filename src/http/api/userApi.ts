import http from '~/http/Http'

interface LoginUser {
  username: string,
  password: string
}

interface RegisterUser {
  name : string,
  password : string,
  email : string,
  institution? : string,
  picture? : BinaryData,
}

function register( registerUser : RegisterUser) {
  return http.post('/user/register', registerUser);
}

function login(loginUser : LoginUser) {
  return http.post('/user/login', loginUser);
}

function logout() {
  return http.post('/user/logout');
}


export default {
  register,
  login,
  logout
}