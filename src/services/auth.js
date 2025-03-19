import bcrypt from 'bcryptjs'

const AUTH_KEY = 'auth_user'
const USERS_KEY = 'registered_users'

const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash)
}

export const authService = {
  getCurrentUser() {
    const userJson = localStorage.getItem(AUTH_KEY)
    return userJson ? JSON.parse(userJson) : null
  },

  getUsers() {
    const usersJson = localStorage.getItem(USERS_KEY)
    return usersJson ? JSON.parse(usersJson) : []
  },

  register(user) {
    const users = this.getUsers()
    if (users.find(u => u.email === user.email)) {
      throw new Error('Bu e-posta adresi zaten kayıtlı')
    }
    const encryptedUser = {
      ...user,
      password: encryptPassword(user.password)
    }
    users.push(encryptedUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    this.login(user)
    return encryptedUser
  },

  login(credentials) {
    const users = this.getUsers()
    const user = users.find(u => u.email === credentials.email)
    if (!user || !comparePassword(credentials.password, user.password)) {
      throw new Error('Geçersiz e-posta veya şifre')
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    return user
  },

  logout() {
    localStorage.removeItem(AUTH_KEY)
  },

  resetPassword(email, newPassword) {
    const users = this.getUsers()
    const userIndex = users.findIndex(u => u.email === email)
    if (userIndex === -1) {
      throw new Error('Kullanıcı bulunamadı')
    }
    users[userIndex].password = encryptPassword(newPassword)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return true
  },

  logout() {
    localStorage.removeItem(AUTH_KEY)
  },

  isAuthenticated() {
    return !!this.getCurrentUser()
  }
}