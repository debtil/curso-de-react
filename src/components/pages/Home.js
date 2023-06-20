import style from './Home.module.css'
import saving from '../../img/savings.svg'
import LinkButton from '../layout/LinkButton'

function Home(){
    return(
        <section className={style.home_Container}>
            <h1>Bem-vindo à <span>Mugiwara</span></h1>
            <p>Comece a gerenciar os seus projetos agora mesmo!</p>
            <LinkButton to="/newproject" text="Criar Projeto"/>
            <img src={saving} alt="Mugiwara"/>
        </section>
    )
}

export default Home