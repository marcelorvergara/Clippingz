import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueRouter from "vue-router";
import { routes } from './routes'
import { store } from "@/store";
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter);
const router = new VueRouter({
  routes,
  mode:'history',
  base: process.env.BASE_URL
})
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: "AIzaSyD_9D6EbI1mtCvCbyzUJsRLYH8rE6b4MKc",
  authDomain: "clipping-z.firebaseapp.com",
  projectId: "clipping-z",
  storageBucket: "clipping-z.appspot.com",
  messagingSenderId: "964065665539",
  appId: "1:964065665539:web:e949b208b8f37afe466436",
  measurementId: "G-WEE9GG8HS2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
