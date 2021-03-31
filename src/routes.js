import ListaNews from "@/components/ListaNews";
import AcessoRestrito from "@/components/AcessoRestrito";
import ConfigNews from "@/components/ConfigNews";
import DetalhesNews from "@/components/DetalhesNews";
import ResultadoPesquisa from "@/components/ResultadoPesquisa";
import PaginaNaoEncontrada from "@/components/PaginaNaoEncontrada"

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
        path: '/ConfigNews',
        name: 'confignews',
        component: ConfigNews
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
    }
]