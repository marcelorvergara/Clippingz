import ListaNews from "@/components/ListaNews";
import AcessoRestrito from "@/components/AcessoRestrito";
import DetalhesNews from "@/components/DetalhesNews";
import ResultadoPesquisa from "@/components/ResultadoPesquisa";
import PaginaNaoEncontrada from "@/components/PaginaNaoEncontrada"
import AcessoRestritoRegistro from "@/components/AcessoRestritoRegistro";
import RegistroNews from "@/components/RegistroNews";

export const routes = [
    {
        path: "*", component: PaginaNaoEncontrada
    },
    {
        path: '',
        name: 'lista',
        component: ListaNews
    },
    {
        path: '/AcessoRestrito',
        name: 'acessorestrito',
        component: AcessoRestrito
    },
    {
        path: '/DetalhesNews/:news',
        name: 'detalhesnews',
        component: DetalhesNews
    },
    {
        path: '/ResultadoPesquisa',
        name: 'resultadopesquisa',
        component: ResultadoPesquisa
    },
    {
        path:'/AcessoRestritoRegistro',
        name: 'acessorestritoregistro',
        component: AcessoRestritoRegistro
    },
    {
        path: '/RegistroNews',
        name: 'registronews',
        component: RegistroNews
    }
]