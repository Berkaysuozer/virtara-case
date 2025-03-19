# Virtara Kitap Projesi

## Proje Hakkında
Virtara Kitap, modern bir kitap alışveriş platformudur. Vue 3 kullanılarak geliştirilmiş, kullanıcı dostu bir web uygulamasıdır.

## Features
- 📚 Kapsamlı kitap kataloğu
- 🛒 Alışveriş sepeti yönetimi
- ❤️ Favori kitaplar listesi
- 🌍 Çoklu dil desteği (Türkçe/İngilizce)
- 💰 Farklı para birimi desteği
- 🔐 Kullanıcı kimlik doğrulama sistemi

## Tech Stack
- Vue.js 3 (Composition API)
- TypeScript
- Vite
- Vue Router
- Vuex
- Vuelidate
- bcrypt.js

## İnitial Setup

- Node.js (v14 veya üzeri)
- npm veya yarn

### Start Project
1. Projeyi klonlayın:
```bash
git clone [proje-url]
cd virtara-case
```

2. Bağımlılıkları yükleyin:
```bash
npm install

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Project Structure
```
src/
├── assets/        # Stil dosyaları ve görseller
├── components/    # Yeniden kullanılabilir Vue bileşenleri
├── data/          # JSON veri dosyaları
├── directives/    # Özel Vue direktifleri
├── locales/       # Dil dosyaları
├── mixins/        # Vue mixinleri
├── router/        # Vue Router yapılandırması
├── services/      # API servisleri ve yardımcı fonksiyonlar
├── store/         # Vuex store modülleri
└── views/         # Sayfa bileşenleri
```

