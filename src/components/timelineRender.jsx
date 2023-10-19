import styled from "styled-components";
import ReactModal from "react-modal";
import React, { useContext, useEffect, useState, useRef } from "react";
import metadata from 'url-metadata';
import apiAuth from "../services/apiAuth.js";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import { PostContext } from "../contexts/postContext.jsx";
import TimelinePage from "../pages/TimelinePage.jsx";

export default function EachPost({ prop }) {
  const user = localStorage.getItem("user")
  const myObj = JSON.parse(user)
  const [edit, setEdit] = useState(0);
  const [liked, setLiked] = useState(prop.usersLikes.includes(myObj.idUser));
  const [likes, setLikes] = useState(Number.parseInt(prop.likes))
  const { setStatusModal, setIdPost, statusModal } = useContext(PostContext)
  const [contentStatus, setContentStatus] = useState(true)
  const [postContent, setPostContent] = useState(prop.postText)
  const inputRef = useRef(null);
  const [count, setCount] = useState(0);
  const [likesUsers, setLikesUsers] = useState([{username: 'fulano'}, {username: 'fulano'}])
  console.log(likesUsers)
  function curtirPost(e) {
    const newLiked = !liked
    setLiked(!liked)
    apiAuth.likePost(prop.id, myObj.token, newLiked)
      .then(() => {
        if (!liked) {
          setLikes(likes + 1)
        } else {
          setLikes(likes - 1)
        }
      })
      .catch(err => {
        alert(err.response.data)
      })
  }

  function searchLikes() {
    apiAuth.getUsersLikes(prop.id, myObj.token)
      .then(res=>{
        setLikesUsers(res.data)
      })
      .catch(err=>alert(err.response.data))
  }

  ReactModal.setAppElement('#root')

  useEffect(() => {

    if (myObj.idUser === prop.idUser) {
      setEdit(1)
    }
    //buscarMetadados();
  }, [])

  const buscarMetadados = async () => {
    try {
      const data = await metadata(prop.postUrl);
      console.log(data)
    } catch (error) {
      console.error('Erro ao buscar metadados', error);
    }
  };

  function openDialog(e) {
    e.preventDefault();
    setStatusModal(true)
    setIdPost(prop.id)
    console.log("open")
  }

  function editText(e) {
    e.preventDefault()
    if (count === 0) {
      setContentStatus(false)
      setCount(1);
    } else {
      setContentStatus(true);
      setPostContent(prop.postText)
      setCount(0);
    }
    setTimeout(() => {
      inputRef.current.focus();
    }, 0);
  }

  function handlePress(e) {
    if (e.key === 'Escape') {
      setPostContent(prop.postText);
      setContentStatus(true)
    }
    if (e.key === 'Enter') {
      const body = {
        postText: postContent
      }
      setContentStatus(true)
      apiAuth.updatePost(myObj.token, prop.id, body)
        .then(res => { })
        .catch(err => {
          alert(err.response.data)
          setContentStatus(false)
        })
    }
  }

  return (
    <>
      <TimelineList data-test="post"
        edit={edit} disText={contentStatus}>

        <div className="addEdit">
          <ion-icon name="trash-outline" data-test="delete-btn" onClick={openDialog}></ion-icon>
          <ion-icon name="pencil-outline" onClick={editText} data-test="edit-btn"></ion-icon>
        </div>
        <div className="sideBarPost">
          <Image data={prop.pictureUrl}></Image>
          <ion-icon name={liked ? 'heart' : 'heart-outline'} onClick={curtirPost}></ion-icon>
          <a data-tooltip-id={`likes-tooltip${prop.id}`} className="tooltipLink" onMouseOver={searchLikes}>
            <p>{likes} likes</p>
          </a>
          <Tooltip
            id={`likes-tooltip${prop.id}`}
            style={{ borderRadius: '3px', background: 'rgba(255, 255, 255, 0.90)', color: 'black' }}
            place="bottom"
          >
            {likes == 0 ? <h3>este post não tem likes</h3> : likes == 1 ? <h3>curtido por {likesUsers[0]?.username}</h3> : <h3>{likesUsers[0]?.username}, {likesUsers[1]?.username} e outras {likes - 2} pessoas </h3>}
          </Tooltip>

        </div>

        <div className="contentPost">
          <p data-test="username">{prop.username}</p>

          <input data-test="description edit-input"
            className="postText"
            disabled={contentStatus}
            ref={inputRef}
            type="text"
            id="text"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            onKeyUp={handlePress}
          />
          <div data-test="link" className="urlPost" onClick={() => window.open(prop.postUrl, '_blank')}>{prop.postUrl}</div>
        </div>
      </TimelineList>
    </>
  )
}


const TimelineList = styled.li`
    margin-top: 20px;
    list-style-type: none;
    width: 100%;
    height: 232px;
    background-color: #171717;
    display: flex;
    border-radius: 10px;
    position: relative;
    @media (max-width: 661px) {
        border-radius: 0px;
      }


    .addEdit{
      cursor: pointer;
      display: ${(props) => props.edit ? "inirit" : "none"};
      :first-child{
      color: white;
      position: absolute;
      right: 25px;
      top: 10px;
      font-size: 20px;
      }
      :last-child{
      color: white;
      position: absolute;
      right: 50px;
      top: 10px;
      font-size: 20px;
      }
    }

    .urlPost{
      margin-top: 10px;
      width: calc(100% - 18px );
      height: 115px;
      border-radius: 10px;
      border: 1px solid  #4D4D4D;
      padding: 5px;
      box-sizing: border-box;
      word-wrap: break-word;
      cursor: pointer;
    }

    .contentPost{
      display: flex;
      flex-direction: column;
      padding: 10px;
      box-sizing: border-box;
      width: 100%;

      .postText{
        width: auto;
        font-family: lato;
        font-size: 15px;
        color:#B7B7B7;
        padding: 2px;
        word-wrap: break-word;
        background-color:${props => props.disText ? "#171717" : "#fff"};
        border: none;
      }

      p{
        color: white;
        font-family: Lato;
        font-size: 17px;
        font-weight: 400;
        line-height: 20px;
        letter-spacing: 0em;
        text-align: left;

      }
    }

    .sideBarPost{
      width: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      box-sizing: border-box;

      p{
        font-family: Lato;
        font-size: 9px;
        font-weight: 400;
        line-height: 11px;
        letter-spacing: 0em;
        text-align: center;
        color: white;
        margin-top: 10px;

      }

      ion-icon{
        cursor: pointer;
        height: 22px;
        color: white;
        margin-top: 10px;
        margin-bottom: -34px;
        z-index: 2;
      }

      .tooltipLink{
        text-decoration: none;
      }

      h3{
        font-family: Lato;
        font-size: 11px;
        font-style: normal;
        font-weight: 700;
      }

      }
`;

const Image = styled.div`

        width: 40px;
        height: 40px;
        border-radius: 26.5px;
        background-image: url(${(props) => JSON.stringify((props.data))});
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        
`








