import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.30/vue.esm-browser.min.js'

const site = 'https://vue3-course-api.hexschool.io/v2/'
const api_path = 'beanhuang'

const app = createApp({
  data() {
    return {
      //先定義品項
      products: [],
      //右邊欄位
      tempProduct: {},
    }
  },
  methods: {
    checkLogin() {
      //取token
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      //每次發送都加進去（預設值發送）
      axios.defaults.headers.common['Authorization'] = token;
      // console.log(token);

      const url = `${site}api/user/check`
      axios.post(url)
        .then(() => {
          this.getProducts(); //觸發取得遠端品項
        }).catch((err) => {
          console.log(err);
        });
    },
    //取得列表
    getProducts() {
      const url = `${site}api/${api_path}/admin/products/all`;

      axios.get(url)
        .then((res) => {
          this.products = res.data.products;
          //物件轉成陣列 console.log(Object.values(this.products))
          //物件跑迴圈
          // Object.values(this.products).forEach(item => {
          //   console.log(item);
          // });
        });
    },
  },
  //生命週期
  mounted() {
    this.checkLogin();
  },
})

app.mount('#app');