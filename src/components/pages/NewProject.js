import { useNavigate } from 'react-router-dom'
import ProjectForm from '../project/ProjectForm'
import style from './NewProject.module.css'

function NewProject(){
    const history = useNavigate();

    function createPost(project){
        project.cost = 0;
        project.services = [];

        fetch('http://localhost:5000/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project)
        }).then((resp) => resp.json()).then((data) =>{
            console.log(data);
            history('/projects', {state:{message: 'Projeto criado com sucesso'}})
        }).catch(err => console.log(err));
    }

    return(
        <div className={style.newProject_container}> 
            <h1>Criar Projeto</h1>
            <p>Crie seu projeto para depois adicionar os serviços</p>
            <ProjectForm btnText="Criar Projeto" handleSubmit={createPost}/>
        </div>
    )
}

export default NewProject