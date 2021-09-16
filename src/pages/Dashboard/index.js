
import {useState,useEffect} from 'react'
import Header from '../../components/Header';
import Title from '../../components/Title';
import './dashboard.css'
import {FiMessageSquare,FiPlus,FiSearch,FiEdit2} from 'react-icons/fi'
import {Link} from 'react-router-dom'
import Modal from '../../components/Modal/modal';

import firebase from '../../services/firebaseConnection'
import {toast} from 'react-toastify'
import {format} from 'date-fns'
import { id } from 'date-fns/locale';

function Dashboard() {
  const listRef = firebase.firestore().collection('chamados').orderBy('criado','desc');

  const [chamados,setChamados]          = useState([]);
  const [isEmpty,setIsEmpty]            = useState(false)
  const [lastDocs,setLastDocs]          = useState();
  const [statusModal, setStatusModal]   = useState(false);
  const [detailsModal,setDetailsModal]  = useState();

  useEffect(()=>{
    
  getChamados();

  return () => {

  }
  },[])

  async function getChamados(){

    await listRef.limit(5).get()
    .then((snapshot)=>{
      infoChamados(snapshot)
    })
   
  }
  

  async function infoChamados(snapshot) {
    const isEmpty = snapshot.length ===0;

    if (!isEmpty){
      let lista=[];
      
      snapshot.forEach((item)=>{
        lista.push({
          id: item.id,
          assunto: item.data().assunto,
          cliente: item.data().cliente,
          clienteId: item.data().clienteId,
          criado: format(item.data().criado.toDate(),'dd/MM/yyyy'),
          status: item.data().status,
          complemento: item.data().Complemento,
        })
        

      })

      const lastDoc = snapshot.docs[snapshot.docs.length-1]; //pegando o ultimo item da lista
      setChamados(chamados=> [...chamados,...lista]); //recebendo a lista nos chamados q ja tem
      setLastDocs(lastDoc);
      

    }else{
      setIsEmpty(true);
    
    }
  }
  async function addMore() {
    await listRef.startAfter(lastDocs).limit(5)
    .get()
    .then(snapshot=>{
      infoChamados(snapshot)
    })

  }

  function openModal(item) {
    setStatusModal(!statusModal)
    setDetailsModal(item)
    
  }


    return (
      <div>
        <Header/>
        <div className='content'>
          <Title name='Atendimentos'>
            <FiMessageSquare size={25}/>
          </Title>
        </div>
        {chamados.length ===0 ?(
          <div className='content'>
          <div className='container dashboard'>
            <span>Nenhum chamado registrado...</span>
            <Link to='/new' className='new'>
                <FiPlus color='#FFF' size={25}/>
              Novo chamado
            </Link>
          </div>
          </div>
        ):(
          <div className='content'>
           <Link to='/new' className='new'>
                <FiPlus color='#FFF' size={25}/>
              Novo chamado
            </Link>
           
              <table>
                <thead>
                  <tr>
                    
                    <th scope='col'>Cliente</th>
                    <th scope='col'>Assunto</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Cadastrado em</th>
                    <th scope='col'>#</th>
                  </tr>
                </thead>
                <tbody>
                  
                    {chamados.map(item=>{
                      return(
                          <tr key={item.id}>
                            <td data-label='Cliente'>{item.cliente}</td>
                            <td data-label='Assunto'>{item.assunto}</td>
                            <td data-label='Status'>{item.status}</td>
                            <td data-label='Status'>
                              <span className='badge' style={{backgroundColor: item.status==='Aberto'? '#5cb85c': '#999'}} >{item.status}</span>
                            </td>
                            <td data-label='Cadastrado'>{item.criado}</td>
                            <td data-label="#">
                                <button className="action" style={{backgroundColor: '#3583f6' }} onClick={()=>openModal(item)}>
                                  <FiSearch color="#FFF" size={17} />
                                </button>
                                <Link className="action" style={{backgroundColor: '#F6a935' }} to={`/new/${item.id}`}>
                                  <FiEdit2 color="#FFF" size={17} />
                                </Link>
                             </td>
                          </tr>
                        
                      )
                    })}

                 
                </tbody>
              </table>

              {!isEmpty && <button className='btn-more' onClick={addMore}>Buscar mais</button>}
           </div>
              
          )}
          
          {statusModal && (
        <Modal
          conteudo={detailsModal}
          close={openModal}
        />
      )}
      </div>
    );
  }
  
  export default Dashboard;
  