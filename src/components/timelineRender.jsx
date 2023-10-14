import styled from "styled-components";
import ReactModal from "react-modal";
import React, { useEffect, useState } from "react";
import getTitleFromUrl from "../services/request.metadata.js";
import apiAuth from "../services/apiAuth.js";

export default function EachPost ({prop}){
  const user = localStorage.getItem("user")
  const myObj = JSON.parse(user)
  const [edit, setEdit] = useState(0)
  

    function curtirPost(e){
        e.preventDefault();
      }
    
      
      useEffect(()=>{
        //const metadata = getTitleFromUrl(prop.postUrl)
        //console.log(metadata)
        if(myObj.idUser === prop.idUser){
          setEdit(1)
        }
      },[])
     

    return(
     
        <TimelineList edit={edit}>
        <div className="addEdit">
        <ion-icon name="trash-outline" ></ion-icon>
        <ion-icon name="pencil-outline"></ion-icon>
        </div>
        <div className="sideBarPost">
        <Image data = {prop.pictureUrl}></Image>
        <ion-icon name="heart-outline" onClick={curtirPost}></ion-icon>
        <p>13 likes</p>
        </div>

        <div className="contentPost">
        <p>{prop.username}</p>
        <p className="postText">{prop.postText}</p>
        <div className="urlPost" onClick={()=> window.open(prop.postUrl, '_blank')}>{prop.postUrl}</div>
        </div>
        
        </TimelineList>
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
      display: ${(props) => props.edit ? "inirit":"none"};
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
        font-family: lato;
        font-size: 15px;
        color:#B7B7B7;
        padding: 2px;
        word-wrap: break-word;
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
        width: 17px;
        height: 15px;
        color: white;
        margin-top: 10px;
        z-index: 2;
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







