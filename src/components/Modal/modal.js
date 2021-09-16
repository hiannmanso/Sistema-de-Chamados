import './modal.css'

 export default function Modal({conteudo,close}) {
     return(
         <div className='modal'>
             <div className= 'container'>
                 
                 <button className='close' onClick={close}>
                     Voltar
                 </button>
                 <div>
                     <h2>Detalhes do chamado</h2>
                     <div className='row'>
                        <span>
                            Clientes <a>{conteudo.cliente}</a>
                        </span>

                     </div>
                     <div className='row'>
                        <span>
                            Assunto <a>{}conteudo.assunto</a>
                        </span>

                     </div>
                     <div className='row'>
                        <span>
                            Cadastrado em <a>{conteudo.criado}</a>
                        </span>
                        <div className="row">
                            <span>
                            Status: <a style={{ color: '#FFF', backgroundColor: conteudo.status === 'Aberto' ? '#5cb85c' : '#999' }}>{conteudo.status}</a>
                            </span>
                        </div>
                        {conteudo.complemento !== '' &&(
                             <div>
                                <h3>Complemento</h3>
                                <p>
                                    {conteudo.complemento}
                                </p>
                             </div>
                        )}

                     </div>

                 </div>
             </div>
         </div>
     )
 }