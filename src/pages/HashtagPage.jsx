import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import EachPost from "../components/timelineRender.jsx";
import MeuComponente from "../components/modalComponent.jsx";
import Header from "../components/Header.jsx";
import { PostContext } from "../contexts/postContext.jsx";
import axios from "axios";

export default function HashtagPage() {
  const navigate = useNavigate();
  const [postsHashtag, setPostsHashtag] = useState([]);
  const [disable, setDisable] = useState(false);
  const { statusModal } = useContext(PostContext);

  const { hashtag } = useParams();

  function getHashtagPosts() {
    setDisable(true);

    const promise = axios.get(
      `${process.env.REACT_APP_API_URL}/hashtag/${hashtag}`
    );

    promise.then((res) => {
      setPostsHashtag(res.data);
      setDisable(false);
    });
    promise.catch((err) => {
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
    getHashtagPosts();
  }, [statusModal]);

  return (
    <Container>
      <MeuComponente />

      <Header />

      <Timeline>
        <HeaderTime>
          <h1 data-test="hashtag-title"># {hashtag}</h1>
        </HeaderTime>

        <Loading aux={disable}>
          <div className="spinner is-animating"></div>
          <p>Loading...</p>
        </Loading>
        {postsHashtag ? (
          <PostsRender>
            {postsHashtag.map((post) => (
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

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 49px;
  width: 100%;

  @media (min-width: 661px) {
    width: 661px;
  }
  @media (max-width: 670px){
    margin-top: 105px;
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

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: baseline;
  align-items: center;
  background-color: #333333;
  height: 100%;
`;
