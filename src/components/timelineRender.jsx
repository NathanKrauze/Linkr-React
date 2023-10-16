import styled from "styled-components";
import ReactModal from "react-modal";
import React, { useContext, useEffect, useState, useRef } from "react";
import metadata from "url-metadata";
import apiAuth from "../services/apiAuth.js";
import { PostContext } from "../contexts/postContext.jsx";
import { Link } from "react-router-dom";

export default function EachPost({ prop }) {
  const user = localStorage.getItem("user");
  const myObj = JSON.parse(user);
  const [edit, setEdit] = useState(0);
  const { setStatusModal, setIdPost, statusModal } = useContext(PostContext);
  const [contentStatus, setContentStatus] = useState(true);
  const [postContent, setPostContent] = useState(prop.postText);
  const inputRef = useRef(null);
  const [count, setCount] = useState(0);

  ReactModal.setAppElement("#root");

  function curtirPost(e) {
    e.preventDefault();
  }

  useEffect(() => {
    if (myObj.idUser === prop.idUser) {
      setEdit(1);
    }
    //buscarMetadados();
  }, []);

  const buscarMetadados = async () => {
    try {
      const data = await metadata(prop.postUrl);
      console.log(data);
    } catch (error) {
      console.error("Erro ao buscar metadados", error);
    }
  };

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
        .then((res) => {})
        .catch((err) => {
          alert(err.response.data);
          setContentStatus(false);
        });
    }
  }

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
      <TimelineList data-test="post" edit={edit} disText={contentStatus}>
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
          <Image data={prop.pictureUrl}></Image>
          <ion-icon name="heart-outline" onClick={curtirPost}></ion-icon>
          <p>13 likes</p>
        </div>

        <div className="contentPost">
          <p data-test="username">{prop.username}</p>

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
            {prop.postUrl}
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
    margin-top: 10px;
    width: calc(100% - 18px);
    height: 115px;
    border-radius: 10px;
    border: 1px solid #4d4d4d;
    padding: 5px;
    box-sizing: border-box;
    word-wrap: break-word;
    cursor: pointer;
  }

  .contentPost {
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
    width: 100%;

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

    ion-icon {
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
