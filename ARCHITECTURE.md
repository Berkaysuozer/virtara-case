# Architecture Overview

## Tech Stack
- Vue.js 3, Composition API, Vue Router, Vuex, Vuelidate, Vite, bcrypt.js 

### Key Features
- Authentication için services klasörü altında auth.js dosyamızı oluşturduk ve gerekli fonksiyonlar eklendi.
- Şifreleme Simülasyonu için bcrypt.js kullanıldı. 
- Form Validation için ise vuelidate kullanıldı. 
- Vue Router ile routelarımızı oluşturduk ve yetkilendirme kontrellerimiz eklendi. 
- Kitap Listelemek için gerekli componentlerimiz oluşturuldu.
- Sonsuz scroll ile pagination eklendi.
- filtreleme fonksiyonlarımız eklendi 
- debounce için lodash kullandık.
- Currency API 'Baglandı ve dinamik olarak currency'i güncellemek için formatter mixini oluturuldu.
- CURRENY API FLOW :
- 1) defaul currency type belirledik ve api'den bu type'ın fiyatı geliyor.
- 2) Kullanıcı currency değiştirdiğinde formatterımıza bu yeni type'ı göndeririz ve api'den bu type'ın fiyatı gelir.
- 3) Bu sayede tek bir kere type'ı formatter'ımıza ileterek bütün app'de bu yeni fiyatı kullanmış oluruz.
- 4) Eğer api error verirse default currency type ile devam eder.
- 5) Olağan akışta 3 dakikada bir tekrar request atarak güncelleme yaparız.
- Vuex ve VuexPersist ile state yönetimi yapıldı.
