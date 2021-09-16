import './customers.css'
import Title from '../../components/Title'
import Header from '../../components/Header';
import {FiUser} from 'react-icons/fi'
import {useState} from 'react'
import firebase from '../../services/firebaseConnection';
import {toast}from 'react-toastify'

export default function Customers(){

    const [nomeFantasia,setNomeFantasia] = useState('')
    const [cnpj,setCnpj] = useState('')
    const [endereço,setEndereço] = useState('')

    async function cadastroEmp(e) {
        e.preventDefault();

        if(nomeFantasia !=='' && cnpj!== '' && endereço!== ''){
        await firebase.firestore().collection('clientes').add({
            nomeFantasia:nomeFantasia,
            cnpj:cnpj,
            endereço:endereço,
        }).then(()=>{
            setEndereço('');
            setNomeFantasia('');
            setCnpj('')
            toast.success(nomeFantasia+' cadastrado com sucesso')
        }).catch((error)=>{
            toast.warning(error)
        })
    }else{
        toast.warning('Preencha todos os campos')
    }
    }


    return(
        <div>
            <Header/>
            <div className='content'>
                <Title name='Clientes'>
                    <FiUser size={25}/>
                </Title>
                
            </div>
            <div className='content'>
                <div className='container'>
                <form onSubmit={cadastroEmp} className='form-profile'>

                    <label>Nome fantasia</label>
                    <input type='text' value={nomeFantasia} onChange={(e)=>setNomeFantasia(e.target.value)}/>

                    <label>CNPJ</label>
                    <input type='text' value={cnpj} onChange={(e)=>setCnpj(e.target.value)}/>

                    <label>Endereço</label>
                    <input type='text' value={endereço} onChange={(e)=>setEndereço(e.target.value)}/>

                    <button type='submit'>Cadastrar</button>
                </form>
            </div>
            </div>
            
        </div>
    )
}