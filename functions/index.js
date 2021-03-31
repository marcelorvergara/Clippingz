const functions = require('firebase-functions');

//buscar notícias na API e guardar no banco
exports.getNews = functions.https.onRequest(async(request,res) => {
    const req = require('request');

    res.set('Access-Control-Allow-Origin', '*');

    //só pegar notícias recentes
    const data0 = hoje();
    const data1 = ontem();
    //pegando os parâmtros passados no get URL
    const kw = request.query.pc;
    const od = request.query.od;
    const id = request.query.id;
    const mp = request.query.np;
    const mpNum = parseInt(mp);

    var linkApi = (`http://newsapi.org/v2/everything?`+`${od}`+`="`+`${kw}`+`"&language=`+`${id}`+`&from=`+`${data1}`+`&to=`+`${data0}`+`&pageSize=`+ `${mpNum}` +`&apiKey=6dfcde728d4041529026d9ccd3dff352`);
    if (request.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        var resp = await reqFunc()
        res.send(`${resp}`)
    }

    async function reqFunc (){
        return new Promise(await function (resolve,reject){
            req.get(linkApi, (err,res,body) => {
                if (err){
                    console.log("Erro na requisição a API: ", err)
                    reject(err)
                }
                if (res.statusCode === 200) {
                        let resultado = JSON.parse(body)
                        console.log('resul: ', resultado.totalResults)
                        resolve(body)

                }
            })
        })
    }
})

// funções auxiliares
function ontem(){
    //um dia atrás
    var old = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return old.toISOString().slice(0,10);
}
function hoje(){
    var datetime = new Date();
    return datetime.toISOString().slice(0,10);
}
