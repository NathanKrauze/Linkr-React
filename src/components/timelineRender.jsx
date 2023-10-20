import styled from "styled-components";
import ReactModal from "react-modal";
import React, { useContext, useEffect, useState, useRef } from "react";
import apiAuth from "../services/apiAuth.js";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import { PostContext } from "../contexts/postContext.jsx";
import { Link, useNavigate} from "react-router-dom";
import { BsSend } from "react-icons/bs";
import { FaRegComments } from "react-icons/fa";



export default function EachPost({ prop, functionP }) {
  const user = localStorage.getItem("user")
  const myObj = JSON.parse(user)
  const [edit, setEdit] = useState(0);
  const [liked, setLiked] = useState(prop.usersLikes?.includes(myObj.idUser));
  const [likes, setLikes] = useState(Number.parseInt(prop.likes))
  const [contentStatus, setContentStatus] = useState(true)
  const [postContent, setPostContent] = useState(prop.postText)  
  const { setStatusModal, setIdPost } =
    useContext(PostContext);
  const inputRef = useRef(null);
  const [count, setCount] = useState(0);
  const [likesUsers, setLikesUsers] = useState([
    { username: "" },
    { username: "" },
  ]);
  const [urlMetaData, setUrlMetaData] = useState({
    title: "",
    description: "",
    image: undefined,
  });
  
  const navigate = useNavigate();

  ReactModal.setAppElement('#root')

  function curtirPost(e) {
    const newLiked = !liked;
    setLiked(!liked);
    apiAuth
      .likePost(prop.id, myObj.token, newLiked)
      .then(() => {
        if (!liked) {
          setLikes(likes + 1);
        } else {
          setLikes(likes - 1);
        }
      })
      .catch(err=>alert(err.response.data))
  }

  function searchLikes() {
    apiAuth
      .getUsersLikes(prop.id, myObj.token)
      .then((res) => {
        setLikesUsers(res.data);
      })
      .catch((err) => alert(err.response.data));
  }

  const fetchMetaData = async () => {
       
      console.log({request: prop.postUrl})
    try {
      const {
        data: { title, description, images },
      } = await axios.get(`https://jsonlink.io/api/extract?url=${prop.postUrl}`);     
      setUrlMetaData(() => ({ title, description, image: images[0] }));
    } catch {
      console.log("error metadata")
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
          functionP("effect")
        })
        .catch((err) => {
          alert(err.response.data);
          setContentStatus(false);
        });
        functionP("effect")
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
  const [textComment, setTextComment] = useState("");
  const [openComments, setOpenComments] = useState(false);

  async function sendComment(e) {
    e.preventDefault();

    const config = {
      headers: {
        Authorization: `Bearer ${myObj.token}`,
      },
    };

    const newComment = {
      idUser: myObj.idUser,
      idPost: prop.id,
      textComment: textComment,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/comments`,
        newComment,
        config
      );

      setTextComment("");
      console.log(response.data);
    } catch (error) {
      console.error("Error: ", error);

      if (error.response) {
        alert(error.response.data);
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  }

  const toggleModal = () => {
    setOpenComments(!openComments);
  };

  return (

    <ContainerPage>
      <TimelineList data-test="post" edit={edit} distext={contentStatus.toString()} iconColor={liked}>
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
          <ion-icon
            name={liked ? "heart" : "heart-outline"}
            data-test="like-btn"
            onClick={curtirPost}
          ></ion-icon>
          <a
            data-tooltip-id={`likes-tooltip${prop.id}`}
            className="tooltipLink"
            onMouseOver={searchLikes}
            href="likes"
          >
            <p data-test="counter">{likes} likes</p>
          </a>

          <IconComments onClick={toggleModal}>
            <FaRegComments color="white" size={21} />
            <p>{prop.comments?.length} comments</p>
          </IconComments>

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

      <ContainerComments openComments={openComments}>
        {prop.comments?.map((comment, i) => (
          <CardContainer key={i}>
            <CardComment>
              <img src={comment.picture} alt="user" />

              <div className="comment">
                <h2>{comment.username}</h2>
                <p>{comment.textComment}</p>
              </div>
            </CardComment>

            <HorizontalLine></HorizontalLine>
          </CardContainer>
        ))}
        <FormComment onSubmit={sendComment}>
          <img src={prop.pictureUrl} alt="user" />

          <InputContainer>
            <input
              placeholder="write a comment..."
              type="text"
              id="textComment"
              value={textComment}
              onChange={(e) => setTextComment(e.target.value)}
              required
            />

            <BtnInput type="submit">
              <BsSend color="white" size={16} />
            </BtnInput>
          </InputContainer>
        </FormComment>
      </ContainerComments>
    </ContainerPage>
  );
}

const ContainerPage = styled.section`
  display: flex;
  flex-direction: column;

  box-sizing: border-box;
`;

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

    .metaText {
      width: 350px;
      h1 {
        color: white;
        font-family: Lato;
        font-size: 16px;
        font-weight: 400;
        line-height: 19px;
        letter-spacing: 0em;
        text-align: left;
      }
      h2 {
        margin-top: 5px;
        color: #9b9595;
        font-family: Lato;
        font-size: 11px;
        font-weight: 400;
        line-height: 13px;
        letter-spacing: 0em;
        text-align: left;
      }
      h3 {
        margin-top: 10px;
        color: #cecece;
        font-family: Lato;
        font-size: 11px;
        font-weight: 400;
        line-height: 13px;
        letter-spacing: 0em;
        text-align: left;
      }
    }

    .metaImg {
      height: 115px;
      width: 200px;
      border-radius: 0 6px 6px 0;
      img {
        position: absolute;
        height: calc(100% + 2px);
        width: 200px;
        right: -1px;
        top: -1px;
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
    @media (min-width: 661px) {
      width: 100%;
    }
    .postText {
      display: ${(props) => (props.distext === "true" ? "none" : "inline")};
      width: 100%;
      font-family: lato;
      font-size: 15px;
      color: #b7b7b7;
      padding: 2px;
      word-wrap: break-word;
      background-color: ${(props) => (props.distext === "true" ? "#171717" : "#fff")};
      border: none;
    }

    .textPostP {
      display: ${(props) => (props.distext === "true" ? "inline" : "none")};
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

    .tooltipLink {
      text-decoration: none;
    }

    h3 {
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

const ContainerComments = styled.div`
  display: ${(props) => (props.openComments ? "flex" : "none")};
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  width: 100%;
  height: 100%;
  background-color: #1e1e1e;
  box-sizing: border-box;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;

const FormComment = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  img {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    margin: 10px 20px;
  }
`;

const InputContainer = styled.div`
  background-color: #252525;
  width: 510px;
  height: 39px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;

  input {
    background-color: #252525;
    border: none;
    width: 80%;
    height: 7px;
  }

  input::placeholder {
    font-family: Lato;
    font-style: italic;
    font-size: 16px;
    font-weight: 700;
    text-align: left;
    color: #575757;
  }
`;

const CardContainer = styled.div`
  width: 100%;
`;

const CardComment = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;

  img {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    margin: 10px 20px;
  }

  .comment {
    display: flex;
    flex-direction: column;
    margin-top: 10px;

    h2 {
      font-family: Lato;
      font-weight: 700;
      font-size: 14px;
      line-height: 18px;
      color: #f3f3f3;
    }

    p {
      font-family: Lato;
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      color: #acacac;
    }
  }
`;

const BtnInput = styled.button`
  background-color: transparent;
  width: 50px;
  border: none;
  padding: 0;
  margin: 0;
`;

const HorizontalLine = styled.div`
  width: 95%;
  height: 1px;
  background-color: #353535;
  margin: 5px 0;
  margin-left: 13px;
`;

const IconComments = styled.div`
  width: 60px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 6px;
  text-align: center;
  cursor: pointer;

  p {
    font-family: Lato;
    font-weight: 400;
    font-size: 11px;
    text-align: center;
    padding-bottom: 10px;
  }
`;
