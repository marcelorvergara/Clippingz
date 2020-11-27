import axios from 'axios'

const state = {
    news:[],
    newsLista: [],
    newsResult:[]
}

const  getters = {
    allNews: state => state.news,
    getNewsLista: state => state.newsLista,
    getNewsResult: state => state.newsResult
}

const mutations = {
    setNews(state,news){
        state.news = news
    },
    resetNews(state){
        state.news = []
    },
    setNewsLista(state,newsLista){
        state.newsLista.push(newsLista)
    },
    resetNewsLista(state){
      state.newsLista = []
    },
    setNewsResult(state,newsResult){
        state.newsResult.push(newsResult)
    },
    resetNewsResult(state){
        state.newsResult = [];
    }
}

const actions ={
    async getNews(context, payload){
        const ont = ontem()
        const hoj = hoje()
        const news =
            (await axios.get (`https://newsapi.org/v2/everything?${payload.onde}=${payload.palavra}&from=${ont}&to=${hoj}&language=pt&apiKey=`))
        context.commit('setNews',news.data.articles)

        //funções auxiliares
        function ontem(){
            //um dia atrás
            var old = new Date(Date.now() - 24 * 60 * 60 * 1000);
            return old.toISOString().slice(0,10);
        }
        function hoje(){
            var datetime = new Date();
            return datetime.toISOString().slice(0,10);
        }
    }
}

export default {
    state,
    actions,
    getters,
    mutations
}

