export interface User {
  name: string,
  email: string,
  password?: string
}

export interface UserComplete {
  id: string,
  name: string,
  email: string,
  password: string
}