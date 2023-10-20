import styled from "styled-components";
import ReactModal from "react-modal";
import React, { useContext, useEffect, useState, useRef } from "react";
import apiAuth from "../services/apiAuth.js";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import { PostContext } from "../contexts/postContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function EachPost({ prop }) {
  const user = localStorage.getItem("user")
  const myObj = JSON.parse(user)
  const [edit, setEdit] = useState(0);
  const [liked, setLiked] = useState(prop.usersLikes?.includes(myObj.idUser));
  const [likes, setLikes] = useState(Number.parseInt(prop.likes))
  const {setStatusModal, setIdPost, setReRenderTimeline } = useContext(PostContext)
  const [contentStatus, setContentStatus] = useState(true)
  const [postContent, setPostContent] = useState(prop.postText)
  const inputRef = useRef(null);
  const [count, setCount] = useState(0);
  const [likesUsers, setLikesUsers] = useState([{username: ''}, {username: ''}])
  const [urlMetaData, setUrlMetaData] = useState({
    title: "",
    description: "",
    image: undefined,
  });

  const navigate = useNavigate();

  ReactModal.setAppElement('#root')

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
      .catch(err=>alert(err.response.data))
  }

  function searchLikes() {
    apiAuth.getUsersLikes(prop.id, myObj.token)
      .then(res=>{
        setLikesUsers(res.data)
      })
      .catch(err=>alert(err.response.data))
  }
  
  const fetchMetaData = async () => {
    try {
      const {
        data: { title, description, images },
      } = await axios.get(`https://jsonlink.io/api/extract?url=${prop.postUrl}`);
      setUrlMetaData(() => ({ title, description, image: images[0] }));
    } catch ({
      response: {
        status: {status},
        statusText,
        data: { message },
      },
    }) {
      console.log(`${status} ${statusText}\n${message}`);
      console.log(urlMetaData) //manter esse console.log
    }
    
  };

  useEffect(() => {
    if (myObj.idUser === prop.idUser) {
      setEdit(1);
    }
    fetchMetaData();
    
  }, []);

 
  function openDialog(e) {
    e.preventDefault();
    setStatusModal(true);
    setIdPost(prop.id);
    console.log("open");
  }

  function editText(e) {
    e.preventDefault();
    if (count === 0) {
      setContentStatus(false);
      setCount(1);
    } else {
      setContentStatus(true);
      setPostContent(prop.postText);

      setCount(0);
    }
    setTimeout(() => {
      inputRef.current.focus();
    }, 0);
  }

  function handlePress(e) {
    if (e.key === "Escape") {
      setPostContent(prop.postText);
      setContentStatus(true);
    }
    if (e.key === "Enter") {
      const body = {
        postText: postContent,
      };
      setContentStatus(true);
      apiAuth
        .updatePost(myObj.token, prop.id, body)
        .then((res) => {
          setCount(0)
        })
        .catch((err) => {
          alert(err.response.data);
          setContentStatus(false);
        });
        setReRenderTimeline(prop.id)
      }}
  
  const boldHashtags = () => {
    return postContent?.split(" ").map((word, i) => {
      if (word[0] === "#") {
        return (
          <StyledLink key={i} to={`/hashtag/${word.replace("#", "")}`}>
            <strong> {word} </strong>
          </StyledLink>
        );
      } else {
        return <span key={i}> {word} </span>;
      }
    });
  };

  const postText = boldHashtags();

  return (
    <>
      <TimelineList data-test="post" edit={edit} disText={contentStatus} iconColor={liked}>
        <div className="addEdit">
          <ion-icon
            name="trash-outline"
            data-test="delete-btn"
            onClick={openDialog}
          ></ion-icon>
          <ion-icon
            name="pencil-outline"
            onClick={editText}
            data-test="edit-btn"
          ></ion-icon>
        </div>
        <div className="sideBarPost">
          <Image data={prop.pictureUrl} ></Image>
          <ion-icon name={liked ? 'heart' : 'heart-outline'} data-test='like-btn' onClick={curtirPost}></ion-icon>
          <a data-tooltip-id={`likes-tooltip${prop.id}`} className="tooltipLink" onMouseOver={searchLikes}>
            <p data-test='counter'>{likes} likes</p>
          </a>
          <Tooltip
            id={`likes-tooltip${prop.id}`}
            style={{ borderRadius: '3px', background: 'rgba(255, 255, 255, 0.90)', color: 'black', zIndex: 10 }}
            place="bottom"
          >
            {likes === 0 ? <h3>este post não tem likes</h3> : likes === 1 ? <h3>curtido por {likesUsers[0]?.username}</h3> : <h3>{likesUsers[0]?.username}, {likesUsers[1]?.username} e outras {likes - 2} pessoas </h3>}
          </Tooltip>
        </div>

        <div className="contentPost">
          <p data-test="username" onClick={()=>navigate(`/user/${prop.idUser}`)}>{prop.username}</p>

          <input
            data-test="edit-input"

            className="postText"
            disabled={contentStatus}
            ref={inputRef}
            type="text"
            id="text"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            onKeyUp={handlePress}
          />

          <p data-test="description" className="textPostP">
            {postText}
          </p>
          <div
            data-test="link"
            className="urlPost"
            onClick={() => window.open(prop.postUrl, "_blank")}
          >
            <div className="metaText">
              <h1>{urlMetaData.title}</h1>
              <h2>{urlMetaData.description}</h2>
              <h3>{prop.postUrl}</h3>
            </div>
            <div className="metaImg">
              {urlMetaData.image && (
                <img src={urlMetaData.image} alt="urlMetaDataImage" />
              )}
            </div>
          </div>
        </div>
      </TimelineList>
    </>
  );
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
  .addEdit {
    cursor: pointer;
    display: ${(props) => (props.edit ? "inirit" : "none")};
    :first-child {
      color: white;
      position: absolute;
      right: 25px;
      top: 10px;
      font-size: 20px;
    }
    :last-child {
      color: white;
      position: absolute;
      right: 50px;
      top: 10px;
      font-size: 20px;
    }
  }

  .urlPost {
    position: relative;
    margin-top: 10px;
    width: calc(100% - 18px);
    height: auto;
    border-radius: 10px;
    border: 1px solid #4d4d4d;
    padding: 20px;
    box-sizing: border-box;
    word-wrap: break-word;
    cursor: pointer;
    display: flex;
    justify-content: space-between;

    .metaText{
      width: 350px;
      h1{
        color:white;
        font-family: Lato;
        font-size: 16px;
        font-weight: 400;
        line-height: 19px;
        letter-spacing: 0em;
        text-align: left;
      }
      h2{
        margin-top: 5px;
        color:#9B9595;
        font-family: Lato;
        font-size: 11px;
        font-weight: 400;
        line-height: 13px;
        letter-spacing: 0em;
        text-align: left;
      }
      h3{
        margin-top: 10px;
        color:#CECECE;
        font-family: Lato;
        font-size: 11px;
        font-weight: 400;
        line-height: 13px;
        letter-spacing: 0em;
        text-align: left;
      }
    }

    .metaImg{
    height: 115px;
    width: 200px;
    border-radius: 0 6px 6px 0;
    img {
      position: absolute;
      height: calc(100% + 2px);
      width: 200px;
      right:-1px;
      top:-1px;
      object-fit: fill;
      border-radius: 0 6px 6px 0;
    }
    }

  }

  .contentPost {
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
    width: 611px;
    @media (max-width: 661px) {
    width:100%
  }
    .postText {
      display: ${(props) => (props.disText ? "none" : "inline")};
      width: auto;
      font-family: lato;
      font-size: 15px;
      color: #b7b7b7;
      padding: 2px;
      word-wrap: break-word;
      background-color: ${(props) => (props.disText ? "#171717" : "#fff")};
      border: none;
    }

    .textPostP {
      display: ${(props) => (props.disText ? "inline" : "none")};
      color: white;
      font-family: Lato;
      font-size: 17px;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: 0em;
      text-align: left;
    }


    p {
      cursor: pointer;
      color: white;
      font-family: Lato;
      font-size: 17px;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: 0em;
      text-align: left;
    }
  }

  .sideBarPost {
    width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;

    p {
      font-family: Lato;
      font-size: 9px;
      font-weight: 400;
      line-height: 11px;
      letter-spacing: 0em;
      text-align: center;
      color: white;
      margin-top: 10px;
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


    ion-icon {
      cursor: pointer;
      width: 17px;
      height: 15px;
      color: ${(props) => (props.iconColor ? "#AC0000" : "white")};
      margin-top: 10px;
      margin-bottom: -35px;
      z-index: 2;
    }
  }
`;

const Image = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 26.5px;
  background-image: url(${(props) => JSON.stringify(props.data)});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;

  strong {
    font-weight: 700;
  }
`;
