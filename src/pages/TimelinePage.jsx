import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import apiAuth from "../services/apiAuth.js";
import EachPost from "../components/timelineRender.jsx";
import MeuComponente from "../components/modalComponent.jsx";
import Header from "../components/Header.jsx";
import { PostContext } from "../contexts/postContext.jsx";
import Trending from "../components/Trending.jsx";
import { useInterval } from 'usehooks-ts'
import InfiniteScroll from 'react-infinite-scroller';

export default function TimelinePage() {
  const navigate = useNavigate();
  const [postUrl, setPostUrl] = useState("");
  const [postText, setPosttext] = useState("");
  const user = localStorage.getItem("user");
  const myObj = JSON.parse(user);
  const [timeline, setTimeline] = useState([]);
  const [disable, setDisable] = useState(false);
  const { statusModal, reRenderTimeline } = useContext(PostContext);
  const [numbNewPosts, setNumbNewPosts] = useState(0);
  const [difCountP, setDifCountP] = useState(0);
  const [hasMoreLoad, sethasMoreLoad] = useState(true);
  const [partialLine, setPartialLine] = useState([])

 function getTimeline(props) {
    if(props === "effect" || props ==="button"){
    apiAuth
      .getTimeline(myObj ? myObj.token : "")
      .then((res) => {
        setNumbNewPosts(res.data.length);
        setTimeline(res.data);
        setDisable(false);
        setDifCountP(0)
        setPartialLine((res.data).slice(0,10))
        return true
      })
      .catch((err) => {
        if (err.code === "ERR_NETWORK") {
          alert("An error occured while trying to fetch the posts, please refresh the page");
        } else {
          console.log(err.message)
          navigate("/");
        }
      })
    }    
    else if(props === "interval"){
      console.log(props)
      apiAuth
      .getTimeline(myObj.token)
      .then((res) => {
        if(res.data.length > numbNewPosts){
        setDifCountP(res.data.length - numbNewPosts)
        }
      })
      .catch((err) => {
        if (err.code === "ERR_NETWORK") {
          alert(
            "An error occured while trying to fetch the posts, please refresh the page"
          );
        } else {
          console.log(err)
          navigate("/");
        }
      });
    }
  }

  useInterval( async () => {
    getTimeline("interval")
    },15000)

  useEffect(() => {
    getTimeline("effect");
  }, [statusModal,reRenderTimeline]);

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
        setPostUrl("");
        setPosttext("");
        setDisable(false);
        window.location.reload()
      })
      .catch((err) => alert("Houve um erro ao publicar seu link"));
  }
 
  const loadMore = (e) => {
    console.log(e)
    if(e>=2){
    const b = partialLine.length + 10
    setPartialLine(timeline.slice(0,b))
    if(timeline.length === partialLine.length || timeline.length === 0) return sethasMoreLoad(false)
  }}

  return (
    <Container>
      <MeuComponente />

      <Header />

      <TimelineContainer>
        <Timeline>
          <HeaderTime >
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

          <NewPostButton dis = {difCountP} onClick={() => window.location.reload()}>
            <p>{difCountP} new posts, load more! </p>
            <ion-icon name="sync-circle-outline"></ion-icon>
          </NewPostButton>

          
          <InfiniteScroll
              dataLength={partialLine.length}
              next={loadMore}
              loadMore={loadMore}
              hasMore={hasMoreLoad}
              loader={
                <Loading aux={disable}>
                    <div className="spinner is-animating"></div>
                    <p>Loading...</p>
                </Loading>
                      }
            >
            {timeline.length>0 ? (
            <PostsRender>
              {partialLine.map((post, index) => (
                <EachPost key={index} prop={post} functionP={getTimeline}/>
              ))}
            </PostsRender>
          ) : timeline.length === 0 ? (
            <p className="anyOnePost" data-test="message">
              There are no posts yet
            </p>
          ) : (
            <></>
          )}
          {hasMoreLoad === false && (
            <p style={{color: 'white', textAlign: 'center', marginBottom:'40px', marginTop:'10px'}}>
              No more posts
              </p>
          )}
          </InfiniteScroll>
        </Timeline>

        <Trending posts={timeline} />
      </TimelineContainer>
    </Container>
  );
}

const NewPostButton = styled.button`
  display: ${(props) => (props.dis > 0 ? "inherit" :"none" )};
  margin-top: 25px;
  height: 61px;
  box-shadow: 0px 4px 4px 0px #00000040;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0;
  
  p{    
    font-family: Lato;
    font-size: 16px;
    font-weight: 400;
    line-height: 19px;
    letter-spacing: 0em;
    text-align: center;

  }
  ion-icon{
    position: absolute;
    top:30%;
    right: 200px;
  }

`;

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

const TimelineContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  @media (max-width: 670px){
    margin-top: 30px;
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
