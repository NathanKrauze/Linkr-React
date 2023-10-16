import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import apiAuth from "../services/apiAuth.js";
import EachPost from "../components/timelineRender.jsx";
import MeuComponente from "../components/modalComponent.jsx";
import { PostContext } from "../contexts/postContext.jsx";
import Trending from "../components/Trending";

export default function TimelinePage() {
  const navigate = useNavigate();
  const [postUrl, setPostUrl] = useState("");
  const [postText, setPosttext] = useState("");
  const user = localStorage.getItem("user");
  const myObj = JSON.parse(user);
  const [timeline, setTimeline] = useState([]);
  const [disable, setDisable] = useState(false);
  const { statusModal } = useContext(PostContext);

  function getTimeline() {
    setDisable(true);
    apiAuth
      .getTimeline(myObj.token)
      .then((res) => {
        setTimeline(res.data);
        setDisable(false);
      })
      .catch((err) => {
        if (err.code === "ERR_NETWORK") {
          alert(
            "An error occured while trying to fetch the posts, please refresh the page"
          );
        } else {
          navigate("/");
        }
      });
  }

  useEffect(() => {
    getTimeline();
  }, [statusModal]);

  function publish(e) {
    e.preventDefault();
    setDisable(true);
    const objPublication = {
      postUrl,
      postText,
    };
    apiAuth
      .postPublish(myObj.token, objPublication)
      .then((res) => {
        getTimeline();
        setPostUrl("");
        setPosttext("");
        setDisable(false);
      })
      .catch((err) => alert("Houve um erro ao publicar seu link"));
  }

  return (
    <Container>
      <MeuComponente />

      <Logo pic={myObj.pictureUrl}>
        <h1>linkr</h1>
        <div className="imgPerfil"></div>
      </Logo>

      <TimelineContainer>
        <Timeline>
          <HeaderTime>
            <h1>timeline</h1>
          </HeaderTime>

          <ShareBar data-test="publish-box">
            <p>What are you going to share today?</p>
            <form onSubmit={publish}>
              <input
                data-test="link"
                placeholder="http//..."
                type="url"
                id="postUrl"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                required
              />

              <input
                data-test="description"
                placeholder="Awesome article about #javascript"
                type="text"
                id="postText"
                value={postText}
                onChange={(e) => setPosttext(e.target.value)}
              />

              <button data-test="publish-btn" type="submit" disabled={disable}>
                {disable ? "Publishing..." : "Publish"}
              </button>
            </form>
          </ShareBar>

          <Loading aux={disable}>
            <div className="spinner is-animating"></div>
            <p>Loading...</p>
          </Loading>

          {timeline ? (
            <PostsRender>
              {timeline.map((post) => (
                <EachPost key={post.id} prop={post} />
              ))}
            </PostsRender>
          ) : (
            <p className="anyOnePost" data-test="message">
              {" "}
              There are no posts yet
            </p>
          )}
        </Timeline>

        <Trending posts={timeline} />
      </TimelineContainer>
    </Container>
  );
}

const Loading = styled.div`
  display: ${(props) => (!props.aux ? "none" : "flex")};
  margin-top: 10px;
  flex-direction: column;
  align-items: center;
  .spinner {
    border: 5px solid #dcdcdc;
    border-left-color: #1877f2;
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
  p {
    font-family: lato;
    color: white;
    margin-top: 5px;
  }
`;

const PostsRender = styled.ul`
  width: 100%;
  margin-top: 10px;
`;

const ShareBar = styled.div`
  width: 100%;
  height: 180px;
  background-color: white;
  position: relative;
  font-family: Lato;
  border-radius: 10px;
  @media (max-width: 661px) {
    border-radius: 0;
  }
  form {
    font-family: Lato;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;

    ::placeholder {
      font-family: Lato;
      font-size: 13px;
      font-weight: 300;
      line-height: 16px;
      letter-spacing: 0em;
      text-align: left;
    }
    :first-child {
      height: 10px;
      width: calc(100% - 18%);
      background-color: #efefef;
      border-color: white;
      color: #707070;
      font-size: 13px;
      font-weight: 300;
      line-height: 16px;
      letter-spacing: 0em;
      text-align: left;
    }
    :nth-child(2) {
      height: 30px;
      width: calc(100% - 18%);
      background-color: #efefef;
      border-color: white;
      color: #707070;
      font-size: 13px;
      font-weight: 300;
      line-height: 16px;
      letter-spacing: 0em;
      text-align: left;
    }
  }
  p {
    margin-top: 5px;
    margin-bottom: 5px;
    color: #707070;
    font-family: Lato;
    font-size: 17px;
    font-weight: 300;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: center;
  }

  button {
    width: 112px;
    height: 22px;
    position: absolute;
    border-radius: 5px;
    right: 19px;
    bottom: 5px;
    font-size: 12px;
    padding: 0;
    text-align: center;
    line-height: 1.5;
    font-family: lato;
  }
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 49px;
  width: 100%;

  @media (min-width: 661px) {
    width: 661px;
  }

  .anyOnePost {
    margin-top: 20px;
    font-family: Oswald;
    font-size: 24px;
    font-weight: 400;
    line-height: 36px;
    letter-spacing: 0em;
    text-align: center;
    color: white;
  }
`;

const HeaderTime = styled.div`
  h1 {
    font-size: 4vh;
    color: #ffffff;
    margin-left: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

const Logo = styled.section`
  display: flex;
  justify-content: left;
  background-color: #151515;
  height: 49px;
  position: fixed;
  width: 100%;
  z-index: 3;

  .imgPerfil {
    position: absolute;
    right: 10px;
    top: 4px;
    background-color: white;
    width: 40px;
    height: 40px;
    border-radius: 26.5px;
    background-image: url(${(props) => JSON.stringify(props.pic)});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  h1 {
    margin-left: 10px;
    color: #ffffff;
    font-family: Passion One;
    font-size: 40px;
    font-weight: 700;
    line-height: 54px;
    letter-spacing: 0.05em;
    text-align: left;
  }
`;

const TimelineContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: baseline;
  align-items: center;
  background-color: #333333;
  height: 100%;
`;
