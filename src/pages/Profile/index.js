import {useState, useContext} from 'react';
import {AuthContext} from '../../contexts/auth';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiSettings, FiUpload } from 'react-icons/fi';
import avatar from '../../assets/avatar.png';
import firebase from '../../services/firebaseConnection'
import {toast} from 'react-toastify'




export default function Profile(){
    const { user,logOut,setUser,saveLocalStorage}  = useContext(AuthContext)
    const [name,setName]           = useState(user && user.name)
    const [email,setEmail]         = useState(user && user.email)
    const [avatarUrl,setAvatarUrl] = useState(user && user.avatarUrl)
    const [imageUrl,setImageUrl]   = useState(null)


    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0]

            if(image.type ==='image/jpeg' || image.type ==='image/png'){
                setImageUrl(image);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]))
            }else{
                toast.warning('Envie uma imagem do tipo PNG ou JPEG')
                setImageUrl(null);
                return null;
            }
        }
    }

    async function handleUpload(){
        const UID = user.uid;
        const sendImg = firebase.storage().ref(`images/${UID}/${imageUrl.name}`)
        .put(imageUrl)
        .then(async ()=>{
            toast.success('foto enviada com sucesso!')

            await firebase.storage().ref(`images/${UID}`).child(imageUrl.name).getDownloadURL()
            .then(async(url)=>{
                console.log(url)
                let urlfoto= url

                await firebase.firestore().collection('users').doc(user.uid).update({
                    avatarUrl: urlfoto,
                    name: name
                }).then(()=>{
                    let data ={
                        ...user,
                        avatarUrl: urlfoto,
                        name:name,
                    }
                    setUser(data);
                    saveLocalStorage(data);
                })
            })
        })
    }

    async function handleSave(e){
        e.preventDefault();

        if(imageUrl ===null && name !== ''){
            await firebase.firestore().collection('users').doc(user.uid).update({
                name:name,
            }).then(()=>{
               let data = {
                    ...user,
                    name:name
                }
            
                setUser(data)
                saveLocalStorage(data)
                toast.info('Informações alteradas com')
            })

        }
        else if(name !=='' && imageUrl !==null){
            handleUpload();
        }
    }

    return(
        <div>
            <Header/>
            <div className='content'>
                <Title name='Meu perfil'>
                    <FiSettings size={25}/>
                </Title>
                <div className='container'>
                    <form  onSubmit={handleSave} className ='form-profile'>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#FFF' size={25}/>
                            </span>
                            <input type='file' accept='image/*' onChange={handleFile}/><br/>
                            {avatarUrl === null ? 
                            <img src={avatar} width='250' height='250' alt='avatar file'/> :
                            <img src={avatarUrl} width='250' height='250' alt='avatar file'/>
                            }
                        </label>

                        <label>Nome</label>
                        <input type='text' value={name} onChange={(e)=>setName(e.target.value)}/>

                        <label>Email</label>
                        <input type='text' value={email} disabled={true}/>
                        
                        <button type='submit' >Salvar</button>
                    </form>
                </div>   
                <div className='container' onClick={()=>logOut()}>
                        <button className='logout-btn'>
                            Sair
                        </button>
                    </div>
            </div>
        </div>
    )
}