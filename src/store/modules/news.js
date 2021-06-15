import axios from 'axios'
import {apiUrl} from '@/store/url';

const state = {
    //lista da tela principal
    newsLista: [],
    //lista com resultados de pesquisa por notícias no Header
    newsResult: [],
    //lista com resultados de pesquisa por notícias para config. do clipping
    newsTemp: [],
    //barra de progresso quando a pesquisa vai na API
    progress: false
}

const getters = {
    getNewsLista: state => state.newsLista,
    getNewsResult: state => state.newsResult,
    getNewsTemp: state => state.newsTemp,
    getProgress: state => state.progress,
}

const mutations = {
    setNewsLista(state, newsLista) {
        state.newsLista.push(newsLista)
    },
    resetNewsLista(state) {
        state.newsLista = []
    },
    setNewsResult(state, newsResult) {
        state.newsResult.push(newsResult)
    },
    resetNewsResult(state) {
        state.newsResult = [];
    },
    setNewsTemp(state, newsTemp) {
        state.newsTemp.push(newsTemp)
    },
    resetNewsTemp(state) {
        state.newsTemp = []
    },
    setProgress(state, value) {
        state.progress = value
    }
}

const actions = {
    //excluir todas as matérias(news)
    excluirNews(context) {
        return new Promise((resolve, reject) => {
            const resolveList = []
            for (let mat of context.getters.getNewsTemp) {
                const postUrl = apiUrl + "/news/" + mat.id
                const options = {
                    method: 'DELETE',
                    url: postUrl,
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true,
                }
                axios.request(options).then(function () {
                    resolveList.push('ok.')
                }).catch(function (error) {
                    reject(error);
                })
            }
            Promise.all(resolveList)
                .then(() => {
                    resolve("ok.")
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    excluirNewsSelected(context, selectedNews) {
        return new Promise((resolve, reject) => {
            const resolveList = []
            for (let mat of selectedNews) {
                const postUrl = apiUrl + "/news/" + mat.id
                const options = {
                    method: 'DELETE',
                    url: postUrl,
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true,
                }
                axios.request(options).then(function () {
                    resolveList.push('ok.')
                }).catch(function (error) {
                    reject(error);
                })
            }
            Promise.all(resolveList)
                .then(() => {
                    resolve("ok.")
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    //busca todas as notícias para exclusão
    async getNewsDBExclusaoTodas(context) {
        context.commit('resetNewsTemp')
        const options = {
            method: 'GET',
            url: apiUrl + '/news',
            withCredentials: true
        }
        await axios.request(options).then(function (response) {
            for (let news of response.data) {
                const newsObj = {
                    author: news.autor,
                    title: news.titulo,
                    url: news.url,
                    urlToImage: news.urlToImage,
                    id: news.id,
                    conteudo: news.conteudo,
                    dataPublicacao: news.dataPublicacao,
                    descricao: news.descricao
                }
                context.commit('setNewsTemp', newsObj)
            }
        }).catch(function (error) {
            console.error(error)
        })
    },
    //busca somente as noticias do dia para exclusão
    async getNewsDBExclusao(context) {
        //busca notícias no db do dia para excluir
        const dataMat = new Date().toLocaleDateString()
        context.commit('resetNewsTemp')
        const options = {
            method: 'POST',
            url: apiUrl + '/newsDay',
            data: {dia: dataMat},
            withCredentials: true
        }
        await axios.request(options).then(function (response) {
            for (let news of response.data) {
                const newsObj = {
                    author: news.autor,
                    title: news.titulo,
                    url: news.url,
                    urlToImage: news.urlToImage,
                    id: news.id,
                    conteudo: news.conteudo,
                    dataPublicacao: news.dataPublicacao,
                    descricao: news.descricao
                }
                context.commit('setNewsTemp', newsObj)
            }
        }).catch(function (error) {
            console.error(error)
        })
    },
    //insere somente notícias selecionadas
    inserirSelected(context, selectedNews) {
        return new Promise((resolve, reject) => {
            const dataMat = new Date().toLocaleDateString()
            const postUrl = apiUrl + "/news"
            const resolveList = []
            for (let mat of selectedNews) {
                const options = {
                    method: 'POST',
                    url: postUrl,
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true,
                    data: {
                        dataPublicacao: dataMat,
                        titulo: mat.title,
                        descricao: mat.description,
                        conteudo: mat.content,
                        urlToImage: mat.urlToImage,
                        url: mat.url,
                        autor: mat.author
                    }
                }
                axios.request(options).then(function () {
                    resolveList.push('ok.')
                }).catch(function (error) {
                    reject(error);
                })
            }
            Promise.all(resolveList)
                .then(() => {
                    resolve("ok.")
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    //inserir noticias que estão no vuex ao invés de trazer da interface
    inserirNews2(context) {
        return new Promise((resolve, reject) => {
            const dataMat = new Date().toLocaleDateString()
            const postUrl = apiUrl + "/news"
            const resolveList = []
            for (let mat of context.getters.getNewsTemp) {
                const options = {
                    method: 'POST',
                    url: postUrl,
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true,
                    data: {
                        dataPublicacao: dataMat,
                        titulo: mat.title,
                        descricao: mat.description,
                        conteudo: mat.content,
                        urlToImage: mat.urlToImage,
                        url: mat.url,
                        autor: mat.author
                    }
                }
                axios.request(options).then(function () {
                    resolveList.push('ok.')
                }).catch(function (error) {
                    reject(error);
                })
            }
            Promise.all(resolveList)
                .then(() => {
                    resolve("ok.")
                })
                .catch((error) => {
                    reject(error)
                })

        })
    },
    //pesquisa de notícias na api java para trazer a lista de notícias de acordo com palavra-chave
    getNewsFunctions(context, payload) {
        return new Promise((resolve, reject) => {
            const getUrl = apiUrl + '/newsSearch'
            let totResult;
            const options = {
                method: 'POST',
                url: getUrl,
                headers: {'Content-Type': 'application/json'},
                withCredentials: true,
                data: {
                    onde: payload.onde,
                    palavraChave: payload.palavra,
                    language: payload.idioma,
                    from: ontem,
                    to: hoje,
                    pageSize: payload.np
                }
            };
            axios.request(options).then(function (resp) {
                if (resp.data === 'login') {
                    resolve(resp.data)
                } else {
                    totResult = resp.data.articles.length
                    context.commit('resetNewsTemp')
                    for (let i = 0; i < resp.data.articles.length; i++) {
                        context.commit('setNewsTemp', resp.data.articles[i])
                    }
                    context.commit('setProgress', false)
                }
            }).then(response => {
                response
                resolve(totResult)
            }, error => {
                reject(error)
            })
        })
    },
    async getNewsDB(context) {
        //busca notícias no db. Será usado na tela principal
        //somente notícias do mesmo dia
        const dataMat = new Date().toLocaleDateString()
        context.commit('resetNewsLista')
        const options = {
            method: 'POST',
            url: apiUrl + '/newsDay',
            data: {dia: dataMat},
            withCredentials: true
        }
        axios.request(options).then(function (response) {
            for (let news of response.data) {
                context.commit('setNewsLista', news)
            }
        }).catch(function (error) {
            console.error(error)
        })
    },
    async pesquisaNewsDB(context, payload) {
        //pesquisa de notícias. Funcinalidade da header
        const options = {
            method: 'GET',
            url: apiUrl + '/newsPat/' + payload.palavra,
            withCredentials: true
        }
        axios.request(options).then(function (response) {
            for (let mat of response.data) {
                context.commit('setNewsResult', mat)
            }
        }).catch(function (error) {
            console.error(error)
        })
    }
}

export default {
    state,
    actions,
    getters,
    mutations
}

// funções auxiliares
function ontem() {
    //um dia atrás
    var old = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return old.toISOString().slice(0, 10);
}

function hoje() {
    var datetime = new Date();
    return datetime.toISOString().slice(0, 10);
}
