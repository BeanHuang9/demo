import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.30/vue.esm-browser.min.js'
import pagination from './pagination.js';

const site = 'https://vue3-course-api.hexschool.io/v2/'
const api_path = 'beanhuang'

//外層定義 空
let productModal = {};
let delProductModal = {};

const app = createApp({
  components: {
    pagination
  },
  data() {
    return {
      //先定義品項
      products: [],
      //右邊欄位
      tempProduct: {
        imagesUrl: [], //多圖
      },
      isNew: false,
      pagination: {},
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
          alert(err.data.message)
          window.location = 'index.html';
        });
    },
    getProducts(page = 1) { // 參數預設值
      //query(使用?代 [?page=${page}] ) 、 param
      const url = `${site}api/${api_path}/admin/products?page=${page}`; //分頁路徑

      axios.get(url)
        .then((res) => {
          this.products = res.data.products;
          this.pagination = res.data.pagination; //取出分頁
        }).catch((err) => {
          alert(err.data.message);
          window.location = 'index.html';
        });
    },

    openModal(status, product) {
      console.log(status, product);
      
      if (status === 'isNew') {
        this.tempProduct = {
          imagesUrl: [],
        }
        productModal.show();
        this.isNew = true;
      } else if (status === 'edit') {
        this.tempProduct = { ...product }; //物件傳參考(淺拷貝)
        productModal.show();
        this.isNew = false;
      } else if (status === 'delete') {
        delProductModal.show();
        this.tempProduct = { ...product }; //物件傳參考(淺拷貝)
      }
      
    },

    

    delProduct() {
      let url = `${site}api/${api_path}/admin/product/${this.tempProduct.id}`;

      axios.delete(url)
        .then((res) => {
          console.log(res);
          this.getProducts(); //執行完後呈現在畫面
          delProductModal.hide();
        });
    },
  },
  //生命週期
  mounted() {
    this.checkLogin();
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false //是否能鍵盤操作
    });

    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));

  },
});

//全域
app.component('productModal', {
  props: ['tempProduct'],
  template: '#templateProModal',
  methods: {
    //新增及編輯都能使用
    updateProduct() {
      let url = `${site}api/${api_path}/admin/product`;
      let httpMethod = 'post';

      // 當不是新增商品時則切換成編輯商品 API
      if (!this.isNew) {
        url = `${site}api/${api_path}/admin/product/${this.tempProduct.id}`;
        httpMethod = 'put';
      }
       
      //送資料用data帶 / []切換方法
      axios[httpMethod](url, { data: this.tempProduct })
        .then((res) => {
          console.log(res);
          this.$emit('get-products')
          productModal.hide();
        });
    },
  },
})

app.mount('#app');