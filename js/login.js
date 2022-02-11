import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.30/vue.esm-browser.min.js'

const site = 'https://vue3-course-api.hexschool.io/v2/'


const app = createApp({
  data() {
    return {
      user: {
        username: '',
        password: '',
      }
    }
  },
  methods: {
    login() {
      //遠端請求 先定義
      const url = `${site}admin/signin`
      axios.post(url, this.user)
        .then((res) => {
          console.log(res);
          //存token & expired (解構寫法)
          const { token, expired } = res.data;
          // console.log(token, expired);
          document.cookie = `hexToken=${token}; expires=${new Date(expired)};`
          //轉址
          window.location = '../product.html'
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
})

app.mount('#app');