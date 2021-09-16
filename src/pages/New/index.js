import { useContext, useEffect, useState } from 'react'
import { FiPlusCircle } from 'react-icons/fi'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { AuthContext } from '../../contexts/auth'
import firebase from '../../services/firebaseConnection'
import './new.css'
import {toast} from 'react-toastify'
import {useHistory,useParams} from 'react-router-dom';



export default function New() {

    const { id } = useParams();
    const history = useHistory();

    const [assunto,setAssunto]           = useState('Suporte')
    const [status,setStatus]             = useState('Aberto')
    const [complemento,setComplemento]   = useState('')

    const [clientes,setClientes]                = useState([]);
    const [loadClientes,setLoadClientes]        = useState(true);
    const [clienteSelected,setClienteSelected]  = useState(0);
    const [idCliente,setIdCliente]              = useState(false)

    const { user } = useContext(AuthContext);


    useEffect(()=>{
        async function clienteChange() {
            await firebase.firestore().collection('clientes').get()
            .then((snapshot)=>{
                let lista =[];

                snapshot.forEach((doc)=>{
                    lista.push({
                        id: doc.id, 
                        nomeFantasia: doc.data().nomeFantasia,
                    })
                })
                if(lista.length ===0){
                    console.log('Nenhuma empresa encontrada')
                    setClientes([{id:'1',nomeFantasia:'frela'}])
                    return
                }
                setClientes(lista);
                setLoadClientes(false);
                
                if(id){
                    
                    loadId(lista);
                }

               
            }).catch((error)=>{
                console.log('error',error)
                setLoadClientes(false)
            })
        }

        clienteChange()
    },[id])

    
    
    function mudarcliente(e) {
        setClienteSelected(e.target.value)
       /* console.log(e.target.value)
       console.log(clientes[e.target.value])  */
    }

    async function handleRegister(e) {
        e.preventDefault();
            
            if(idCliente){
                await firebase.firestore().collection('chamados').doc(id).update({
                    criado: new Date(),
                    cliente: clientes[clienteSelected].nomeFantasia,
                    clienteId:clientes[clienteSelected].id,
                    assunto:assunto,
                    status:status,
                    Complemento: complemento,
                }).then(()=>{
                    toast.success('chamado editado com sucesso!')
                    setClienteSelected(0);
                    setComplemento('');
                    history.push('/dashboard')
                }).catch(error=>{
                    toast.error(error)
                })
            return
            }

            await firebase.firestore().collection('chamados').add({
                criado: new Date(),
                cliente: clientes[clienteSelected].nomeFantasia,
                clienteId:clientes[clienteSelected].id,
                assunto:assunto,
                status:status,
                Complemento: complemento,
            }).then(()=>{
                toast.success('Chamado cadastrado com sucesos!');
                setComplemento('');
                setClienteSelected(0);
            }).catch((error)=>{
                toast.error(error)
            })

    }

    async function loadId(lista){
        await firebase.firestore().collection('chamados').doc(id).get()
        .then((snapshot)=>{
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().Complemento);

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
            setClienteSelected(index);
            setIdCliente(true);
        }).catch(error=>{
            console.log(error)
            setIdCliente(false);
        })
    }

    function handleOptionChange(e) {
        setStatus(e.target.value)
    }

    return(
        <div>
            <Header/>
            <div className='content'>
                <Title name='Novo chamado'>
                    <FiPlusCircle size={25}/>
                </Title>

            </div>
            <div className='content'>
                <div className='container'>
                    <form onSubmit={handleRegister} className='form-profile'>

                        <label>Cliente</label>
                        {loadClientes ?(
                            <input type='text' value='carregando clientes...' disabled></input>
                        ):(
                                <select value ={clienteSelected} onChange={mudarcliente}>
                            {clientes.map((item, index)=>{
                                return(
                                    <option key={item.id} value={index}>
                                        {item.nomeFantasia}
                                    </option>
                                )
                            })}
                                
                            </select>
                        )}
                        

                        <label>Assunto</label>
                        
                        <select value={assunto} onChange={(e)=>setAssunto(e.target.value)}>
                            
                            <option value='Suporte'>Suporte</option>
                            <option value='Visíta Tenica'>Visita tenica</option>
                            <option value='financeiro'>Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className='stauts'>
                            
                            <input   type ='radio' name='radio' value='Aberto' onChange={handleOptionChange} checked={status ==='Aberto'}/>
                            <span>Em aberto</span>
                            <input  type ='radio' name='radio' value='Progresso'onChange={handleOptionChange} checked={status ==='Progresso'}/>
                            <span>Progesso</span>
                            <input  type ='radio' name='radio' value='Atendido' onChange={handleOptionChange}checked={status ==='Atendido'}/>
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea type='text' value ={complemento} onChange={(e)=>setComplemento(e.target.value)} placeholder='Descreva seu problema(opcional)'/>
                        
                        <button type='submit'>Salvar</button>
                </form>
            </div>
        </div>
        </div>
    )
}