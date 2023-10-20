import { useEffect, useState } from "react";
import Header from "../components/Header";
import apiAuth from "../services/apiAuth";
import { useNavigate, useParams } from "react-router-dom";
import EachPost from "../components/timelineRender";
import styled from "styled-components";
import Trending from "../components/Trending";

export default function UserPage() {
  const user = localStorage.getItem("user");
  const myObj = JSON.parse(user);
  const [userContent, setUserContent] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    apiAuth.getUser(id, myObj.token)
      .then(res => setUserContent(res.data))
      .catch((err) => {
        if (err.code === "ERR_NETWORK") {
          alert(
            "An error occured while trying to fetch the posts, please refresh the page"
          );
        } else {
          console.log(err)
          navigate("/");
        }
      })
  }, [id])

  return (
    <Container>
      <Header />
      <TimelineContainer>
        <Timeline>
          <HeaderTime>
            <img src={userContent[0]?.pictureUrl} alt='userProfile' />
            <h1>{userContent[0]?.username}'s posts</h1>
          </HeaderTime>


          {userContent.length > 0 ? (
            <PostsRender>
              {userContent.map((post) => (
                <EachPost key={post.id} prop={post} />
              ))}
            </PostsRender>
          ) : userContent.length === 0 ? (
            <p className="anyOnePost" data-test="message">
              There are no posts yet
            </p>
          ) : (
            <></>
          )}
        </Timeline>
        <Trending posts={userContent} />

      </TimelineContainer>
    </Container>
  )
}

const PostsRender = styled.ul`
  width: 100%;
  margin-top: 10px;
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

const TimelineContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  @media (max-width: 670px){
    margin-top: 30px;
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
  display: flex;
  img{
    width: 55px;
    height: 55px;
    border-radius: 30px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin-left: 10px;
    margin-top: 40px;
    margin-bottom: 10px;

  }
  h1 {
    font-size: 4vh;
    color: #ffffff;
    margin-left: 10px;
    margin-top: 45px;
    margin-bottom: 10px;
  }
`;