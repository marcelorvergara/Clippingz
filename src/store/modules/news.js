import axios from 'axios'
import firebase from "firebase/app"

const state = {
    news:[],
    newsLista: [],
    newsResult:[],
    newsTemp:[]
}

const  getters = {
    getNewsLista: state => state.newsLista,
    getNewsResult: state => state.newsResult,
    getNewsTemp: state => state.newsTemp
}

const mutations = {
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
    },
    setNewsTemp(state,newsTemp){
      state.newsTemp.push(newsTemp)
    },
    resetNewsTemp(state){
        state.newsTemp = []
    }
}

const actions ={
    //chama uma function fire para inserir no banco as notícias pesquisadas
    //conforme os parâmetros passados no payload
    async getNewsFunctions(context, payload){
        const pchave = encodeURI(`?pc=`+`${payload.palavra}`);
        const onde = `&od=`+`${payload.onde}`;
        const idioma = `&id=`+`${payload.idioma}`;
        const numPub = `&np=`+`${payload.np}`;
        const user = `&user=` + `${payload.user}`
        //prod
        // const getUrl = encodeURI(`https://us-central1-clippingz.cloudfunctions.net/getNews${pchave}${onde}${idioma}${numPub}${user}`)
        //dev
        const getUrl = encodeURI(`http://localhost:5001/clippingz/us-central1/getNews${pchave}${onde}${idioma}${numPub}${user}`)
        // eslint-disable-next-line no-unused-vars
        await axios.get (getUrl).then(function(resp){
             console.log('fim', resp)
         })

    },
    //listener para apresentar os resultados na pag. de configuração de notícias
    async getNewsTempDB(context,payload){
        const db = firebase.firestore().collection(payload.user)
        db.onSnapshot(function(querySnapshot) {
            context.commit('resetNewsTemp')
            querySnapshot.forEach(function(doc) {
                context.commit('setNewsTemp',doc.data())
            });
        });
    }
}

export default {
    state,
    actions,
    getters,
    mutations
}

