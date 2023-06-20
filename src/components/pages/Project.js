import style from './Project.module.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from '../layout/Loading';
import Container from '../layout/Container';
import ProjectForm from '../project/ProjectForm';
import Message from '../layout/Message';
import ServiceForm from '../service/ServiceForm';
import {parse, v4 as uuidv4} from 'uuid';
import ServiceCard from '../service/ServiceCard';

function Project(){

    const {id} = useParams();
    const [project, setproject] = useState([]);
    const [services, setServices] = useState([]);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [message, setMessage] = useState();
    const [type, setType] = useState();
    const [showServiceForm, setShowServiceForm] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(resp => resp.json()).then((data) => {
                setproject(data);
                setServices(data.services);
            }).catch(err => console.log(err))
        }, 1000)
    }, [id])

    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm(){
        setShowServiceForm(!showServiceForm)
    }

    function editPost(project){
        setMessage('');
        if(project.budget < project.cost){
            setMessage('O orçamento não pode ser menor que o custo do projeto')
            setType('error')
            return false
        }
        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(project),
        }).then(resp => resp.json()).then((data) =>{
            setproject(data);
            setShowProjectForm(false)
            setMessage('Projeto Atualizado')
            setType('succes')
        }).catch(err => console.log(err))
    }

    function createService(project){
        setMessage('');

        const lastService = project.services[project.services.length -1]

        lastService.id = uuidv4();
        
        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        if(newCost > parseFloat(project.budget)){
            setMessage('Orçamento ultrpassado, verifique o valor do serviço');
            setType('error');
            project.services.pop();
            return false;
        }

        project.cost = newCost;

        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        }).then((resp) => resp.json()).then((data) => {
            console.log(data);
            setMessage('Serviço Adicionado')
            setType('succes')
            setShowServiceForm(false)
        }).catch((err) => console.log(err))
    }

    function removeService(id, cost){
        const servicesUpdated = project.services.filter((service) => service.id !== id)
        const projectUpdated = project

        projectUpdated.services = servicesUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        }).then((resp) => resp.json()).then((data) => {
            setproject(projectUpdated)
            setServices(servicesUpdated)
            setMessage('Serviço removido com sucesso')
            setType('succes')
        }).catch((err) => console.log(err))
    }   

    return(
        <>
            {project.name ? (
            <div className={style.project_details}>
                <Container customClass="column">
                    {message && <Message type={type} msg={message}/>}
                    <div className={style.details_container}>
                        <h1>Projeto : {project.name}</h1>
                        <button onClick={toggleProjectForm} className={style.btn}> {!showProjectForm ? 'Editar Projeto' : 'Fechar'}</button>
                        {!showProjectForm ? (
                            <div className={style.project_info}>
                                <p><span>Categoria:</span> {project.category.name}</p>

                                <p><span>Total de Orçamento:</span> R${project.budget}</p>

                                <p><span>Total Utilizado:</span> R$ {project.cost}</p>

                            </div>) : (
                            <div className={style.project_info}>
                                <ProjectForm handleSubmit={editPost} btnText="Concluir Edição"  projectData={project}/>
                            </div>)}
                    </div>
                    <div className={style.service_form_container}>
                        <h2>Adcione um serviço:</h2>
                        <button onClick={toggleServiceForm} className={style.btn}> {!showProjectForm ? 'Adicionar serviço' : 'AAA'}</button>
                        <div className={style.project_info}>
                            {showServiceForm && (<ServiceForm handleSubmit={createService} textBtn="Adicionar serviço" projectData={project}/>)}
                        </div>
                    </div>
                    <h2>Serviços</h2>
                    <Container customClass="start">
                            {services.length > 0 && services.map((service) => (<ServiceCard id={service.id} name={service.name} cost={service.cost} description={service.description} key={service.id} handleRemove={removeService}/>))
                            }{services.length === 0 && <p>Não há serviços cadastrados</p>}
                    </Container>
                </Container>
            </div>): (<Loading />)}
        </>
    )
}

export default Project;