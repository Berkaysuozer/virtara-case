import { required, email, minLength, helpers } from '@vuelidate/validators'

const withMessage = helpers.withMessage

export const authValidationRules = {
  login: {
    email: { 
      required: withMessage('E-posta adresi zorunludur', required),
      email: withMessage('Geçerli bir e-posta adresi giriniz', email)
    },
    password: { 
      required: withMessage('Şifre zorunludur', required),
      minLength: withMessage('Şifre en az 6 karakter olmalıdır', minLength(6))
    }
  },
  register: () => {
    const rules = {
      email: { 
        required: withMessage('E-posta adresi zorunludur', required),
        email: withMessage('Geçerli bir e-posta adresi giriniz', email)
      },
      password: { 
        required: withMessage('Şifre zorunludur', required),
        minLength: withMessage('Şifre en az 6 karakter olmalıdır', minLength(6))
      }
    }
    return rules
  },
  forgotPassword: {
    email: { 
      required: withMessage('E-posta adresi zorunludur', required),
      email: withMessage('Geçerli bir e-posta adresi giriniz', email)
    },
    newPassword: { 
      required: withMessage('Yeni şifre zorunludur', required),
      minLength: withMessage('Şifre en az 6 karakter olmalıdır', minLength(6))
    }
  }
}