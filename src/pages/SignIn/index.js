import {useState, useContext} from 'react'
import logo from '../../assets/logo.png'
import {Link} from 'react-router-dom'
import './signin.css'
import {AuthContext} from '../../contexts/auth'


function SignIn() {

  const {loadingAuth,logIn} = useContext(AuthContext);
  const [email,setEmail]             = useState('');
  const [password,setPasssword]      = useState('');


  function handdleSubmit(e){
    e.preventDefault();
    if (email !== '' && password !== ''){
      logIn(email,password)
    
    }
  }

    return (
      <div className='container-center'> 
        <div className='login'>
          <div className='logo-area'>
            <img src={logo} alt='logo img'/>
          </div>

          <form onSubmit={handdleSubmit}>
            <h1>Entrar</h1>
            <input type='text' placeholder='email@email.com' value={email} onChange={(item) => setEmail(item.target.value)}/>
            <input type='password' placeholder='*******' value={password} onChange={(item) => setPasssword(item.target.value)}/>
            <button type='submit'>{loadingAuth ? 'Carregando...': 'Acessar'}</button>
          </form>
          <Link to ='/register'>Criar conta</Link>
        </div>
      </div>
    );
  }
  
  export default SignIn;
  