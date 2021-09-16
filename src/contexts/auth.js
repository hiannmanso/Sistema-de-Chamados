import {useState,createContext, useEffect} from 'react';
import firebase from '../services/firebaseConnection';
import {toast} from 'react-toastify'


export const AuthContext =createContext({});

function AuthProvider({children}){
    
    const [user,setUser]               = useState(null)
    const [loadingAuth,setLoadingAuth] = useState(false)
    const [loading,setLoading]         = useState(true)


    


    useEffect(()=>{

        function loadStorage(){
            const storageUser = localStorage.getItem('SistemaUser');
        if(storageUser){
            setUser(JSON.parse(storageUser));
            setLoading(false);
        }
        setLoading(false)
        }
        loadStorage()
    },[])

    async function newUser(email,password,name){
        setLoadingAuth(true);

        await firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(async (event)=> {
            let uid = event.user.uid
            await firebase.firestore().collection('users').doc(uid).set({
                name: name,
                avatarUrl: null,
            }).then( ()=>{
                let data = {
                    uid: uid,
                    name: name,
                    email: event.user.email,
                    avatarUrl: null,

                }
                setUser(data);
                setLoadingAuth(false);
                saveLocalStorage(data);
                toast.success('Bem vindo a plataforma '+ data.name)
            })
        }).catch((error)=>{
            alert(error)
            setLoadingAuth(false)
            toast.error('Ops algo deu errado!')
        })
    }

    async function saveLocalStorage(data){
        localStorage.setItem('SistemaUser',JSON.stringify(data))
        toast.info(data.name+'salvo ao localStorage')
    }

    async function logOut(){
        await firebase.auth().signOut();
        setUser(null);
        localStorage.removeItem('SistemaUser')
        
        toast.info('Você saiu da sua conta.')
    }
    
    async function logIn(email,password){
        setLoadingAuth(true)
        await firebase.auth().signInWithEmailAndPassword(email,password)
        .then(async(value)=>{
            let uid = value.user.uid

            const infosUser = await firebase.firestore().collection('users').doc(uid).get();

            let data ={
                uid      : uid,
                name     : infosUser.data().name,
                avatarUrl: infosUser.data().avatarUrl,
                email    : value.user.email,

            }

            setUser(data);
            saveLocalStorage(data);
            setLoadingAuth(false);
            toast.sucess('Você está logado')

        }).catch((error)=>{
            setLoadingAuth(false);
            
            toast.warning('Aconteceu algum erro!'+error)
        })
    }
    

    return(
        <AuthContext.Provider value={{signed: !!user,
                                     user,
                                     loading,
                                    newUser,
                                    logOut,
                                    logIn,
                                    loadingAuth,
                                    setUser,
                                    saveLocalStorage,
                                   }}>
            {children}
        </AuthContext.Provider>
    )
}


export default AuthProvider;