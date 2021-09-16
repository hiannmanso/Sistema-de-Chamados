import logo from '../../assets/logo.png'
import {Link} from 'react-router-dom'
import {useState, useContext} from 'react'
import firebase from '../../services/firebaseConnection';
import {AuthContext} from '../../contexts/auth'



function SignUp() {

  const [name,setName]               = useState('');
  const [email,setEmail]             = useState('');
  const [password,setPasssword]      = useState('');


    const {loadingAuth,newUser} = useContext(AuthContext);

    function handleAdd(e){
      e.preventDefault();
      if(name !== '' && email !== '' && password !== ''){
        newUser(email,password,name);
        
      }else{
        alert('Você esqueceu de preencher uma informação')
      }
    }

    return (
      <div className='container-center'>
        <div className='login'>
          <div className='logo-area'>
            <img src={logo}/>
          </div>
            <form onSubmit={handleAdd}>
              <input type='text' placeholder='Nome' value={name} onChange={(item)=>setName(item.target.value)}/>
              <input type='text' placeholder='Email' value={email} onChange={(item)=>setEmail(item.target.value)}/>
              <input type='password' placeholder='Senha'value={password} onChange={(item)=>setPasssword(item.target.value)}/>
              <button type='submit'>{loadingAuth ? 'Carregando...': 'Criar conta!'}</button>
            </form>
              <Link to ='/'>Já possuo uma conta!</Link>
        </div>
        
      </div>
    );
  }
  
  export default SignUp;
  