import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { PostContext } from '../contexts/postContext';
import apiAuth from '../services/apiAuth';
import styled from 'styled-components';

Modal.setAppElement('#root'); 

function MeuComponente() {
    const {statusModal, setStatusModal} = useContext(PostContext);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const {idPost, setIdPost} = useContext(PostContext);
    const user = localStorage.getItem("user")
    const myObj = JSON.parse(user)
    const [disable, setDisable] = useState(false)

  useEffect(()=>{
   if(statusModal === true){
    setModalIsOpen(true)
   }else{
    setModalIsOpen(false)
   }    
  },[statusModal])


  const closeModal = () => {
    setModalIsOpen(false);
    setStatusModal(false)
    setIdPost(0)
  };

  const confirmModal = () => {
    setDisable(true);
    apiAuth.deletePost(myObj.token,JSON.stringify(idPost))
    .then (res => {
        setDisable(false)
        setModalIsOpen(false);
        setStatusModal(false)

        //window.location.reload();
    })
    .catch(err => {
        alert(`${idPost}`,err.response.data)
    })
  }



  return (
    
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Delete post"
      >
        <StyledModal>
        <h2>Are you sure you want to delete this post?</h2>
        <menu>
            <button className='cancel' onClick={closeModal} data-test="cancel" >No, go back</button>
            <button className='confirm' onClick={confirmModal} data-test="confirm">Yes, delete it</button>
        </menu>
        <Loading aux = {disable}>
        <div className="spinner is-animating"></div>
        <p>Loading...</p>
        </Loading>
        </StyledModal>
      </Modal>
    
    
  );
}

const StyledModal = styled.div`
@media(max-width: 661px){
    width: 100%;
    padding: 40px;
}

z-index: 1000;
background-color: #333333;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
width: 597px;
height: auto;
position: absolute;
top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
border-radius: 50px;
padding: 80px;
box-sizing: border-box;
;
    h2{
        font-family: Lato;
        font-size: 34px;
        font-weight: 700;
        line-height: 41px;
        letter-spacing: 0em;
        text-align: center;
        color: white;
        @media(max-width: 661px){
            width: 100%;
        }
    }
    menu{
        display: flex;
        width: 500px;
        justify-content: space-around;
        margin-top: 20px;
        align-items: center;
        @media(max-width: 661px){
            width: 100%;
        }
        :first-child{
            padding: 0;
            width: 134px;
            height: 37px;
            font-size: 18px;
            background-color: white;
            color: #1877F2;
            font-family: lato;
        }
        :last-child{
            padding: 0;
            height: 37px;
            width: 134px;
            font-size: 18px;
            font-family: lato;
        }
    }
`;

const Loading = styled.div`
display: ${(props) => !props.aux ? "none" : "flex"};
margin-top: 10px;
flex-direction: column;
align-items: center;
  .spinner{
  border: 5px solid #DCDCDC;
	border-left-color: #1877F2;
	border-radius: 100%;
	height: 50px;
	width: 50px;
    @keyframes loading {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
  .spinner.is-animating {
	  animation: loading 2s linear infinite;
  }
  p{
    font-family: lato;
    color: #1877F2;
    margin-top: 5px;
  }

`;

export default MeuComponente;