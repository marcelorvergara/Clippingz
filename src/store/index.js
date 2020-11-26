import Vue from 'vue';
import Vuex from 'vuex';
import news from './modules/news'
import user from "@/store/modules/user";

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules:{
        news,
        user
    }
});