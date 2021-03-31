import axios from 'axios'
import firebase from 'firebase';

const state = {
    //lista da tela principal
    newsLista: [],
    //lista com resultados de pesquisa por notícias no Header
    newsResult:[],
    //lista com resultados de pesquisa por notícias para config. do clipping
    newsTemp:[],
    //barra de progresso quando a pesquisa vai na API
    progress: false
}

const  getters = {
    getNewsLista: state => state.newsLista,
    getNewsResult: state => state.newsResult,
    getNewsTemp: state => state.newsTemp,
    getProgress: state => state.progress,
}

const mutations = {
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
    },
    setProgress(state,value){
        state.progress = value
    }
}

const actions = {
    inserirNews(context,payload){
        const news = payload.mat;
        return new Promise((resolve,reject) =>{
            inserir(news).then(response => {
                resolve (response)
            }, error => {
                reject (error)
            })
      })
        function inserir (mat){
            return new Promise((resolve,reject) => {
                const db = firebase.firestore().collection("materias")
                const dataMat = new Date().toLocaleDateString()
                for (let i = 0; i < mat.length; i++) {
                    db.doc()
                        .set({
                            dataMat: dataMat,
                            title: mat[i].title,
                            desc: mat[i].description,
                            content: mat[i].content,
                            urlToImage: mat[i].urlToImage,
                            url: mat[i].url,
                            author: mat[i].author
                        }, {merge: true})
                        .then(() => {
                            resolve('ok')
                            context.commit('resetNewsTemp')
                        }, error => {
                            reject (error)
                        })
                }
            })
        }
    },
    //chama uma function fire para inserir no banco as notícias pesquisadas
    //conforme os parâmetros passados no payload
    getNewsFunctions(context, payload){
        return new Promise((resolve, reject) => {
            const pchave = encodeURI(`?pc=`+`${payload.palavra}`);
            const onde = `&od=`+`${payload.onde}`;
            const idioma = `&id=`+`${payload.idioma}`;
            const numPub = `&np=`+`${payload.np}`;
            //prod
            const getUrl = encodeURI(`https://us-central1-clipping-z.cloudfunctions.net/getNews${pchave}${onde}${idioma}${numPub}`)
            //dev
            // const getUrl = encodeURI(`http://localhost:5001/clipping-z/us-central1/getNews${pchave}${onde}${idioma}${numPub}`)
            var totResult;
            // eslint-disable-next-line no-unused-vars
            axios.get (getUrl).then(function(resp){
                totResult = resp.data.articles.length
                context.commit('resetNewsTemp')
                for (let i=0; i < resp.data.articles.length; i++){
                    context.commit('setNewsTemp',resp.data.articles[i])
                }
                context.commit('setProgress',false)
            }).then(response => {
                response
                resolve(totResult)
            }, error => {
                reject(error)
            })
        })
    },
    async excluitMatDB(context, payload) {
        const materiasExcl = payload.materiasExcl
        const db = firebase.firestore()
        for (let i = 0; i < materiasExcl.length; i++) {
            var matTit = materiasExcl[i].title
            var materia = await db.collection('materias')
                    .where('title', '==', matTit);
            materia.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.ref.delete();
                });

            });
        }
    },
    async getNewsDB(context){
        //busca notícias no db. Será usado na tela principal
        context.commit('resetNewsLista')
        const dataMat = new Date().toLocaleDateString()
        // eslint-disable-next-line no-unused-vars
        const db = await firebase.firestore().collection("materias")
            .where('dataMat','==',dataMat)
            .get()
            .then((querySnapshot) =>{
                querySnapshot.forEach((doc) => {
                    context.commit('setNewsLista',doc.data())
                });
            })
            .catch(function(error) {
                console.error("Error getting documents: ", error);
            });
    },
    async pesquisaNewsDB(context,payload){
        //pegando as notícias do banco somente do dia atual para não pesar a consulta
        //insere o resultado no listaMaterias e a pesquisa é feita pelos campos descrição e titulo
        const palavraChave = payload.palavra;
        var listaMaterias = [];
        const dataMat = new Date().toLocaleDateString()
        // eslint-disable-next-line no-unused-vars
        const db = await firebase.firestore().collection("materias")
            .where('dataMat','==',dataMat)
            .get()
            .then((querySnapshot) =>{
                querySnapshot.forEach((doc) => {
                    listaMaterias.push(doc.data())
                });

                for (let i = 0; i < listaMaterias.length; i++){
                    if (listaMaterias[i].desc.toLowerCase().includes(palavraChave.toLowerCase()) ||
                        listaMaterias[i].title.toLowerCase().includes(palavraChave.toLowerCase()))
                    {
                        context.commit('setNewsResult',listaMaterias[i])
                    }
                }
            })
            .catch(function(error) {
                console.error("Error getting documents: ", error);
            });
    }
}

export default {
    state,
    actions,
    getters,
    mutations
}

