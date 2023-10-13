
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import apiAuth from "../services/apiAuth.js";
import EachPost from "../components/timelineRender.jsx";

export default function TimelinePage() {
  const navigate = useNavigate();
  const [postUrl, setPostUrl] = useState("");
  const [postText, setPosttext] = useState("");
  const user = localStorage.getItem("user")
  const myObj = JSON.parse(user)
  const [timeline, setTimeline] = useState([])
  
  function getTimeline(){
    apiAuth.getTimeline(myObj.token)
    .then(res => {
      setTimeline(res.data)
    })
    .catch(err => alert(err.message))

  }

  useEffect(()=>{
  getTimeline()
  },[]);
  

  function publish(e){
    e.preventDefault();

    const objPublication= {
      postUrl,
      postText
    };
    
    apiAuth.postPublish(myObj.token, objPublication)
    .then(res =>{
      getTimeline()
      setPostUrl("")
      setPosttext("")
    })
    .catch(err => alert(err.message))
  }

  
  
  return (

  <Container>
    <Logo pic = {myObj.pictureUrl}>
      <h1>linkr</h1>
      <div className="imgPerfil"></div>
    </Logo>
    <Timeline>
      <HeaderTime>
        <h1>timeline</h1>
      </HeaderTime>

      <ShareBar>
        <p>What are you going to share today?</p>
        <form onSubmit={publish}>
          <input
          placeholder="http//..."
          type="url"
          id="postUrl"
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          required
          />

          <input
          placeholder="Awesome article about #javascript"
          type="text"
          id="postText"
          value={postText}
          onChange={(e) => setPosttext(e.target.value)}
          />
          
          <button type="submit">
           Publish
          </button>
        </form>
      </ShareBar>

      <PostsRender>
        {timeline.map((post)=>(
          <EachPost key={post._id} prop={post}/>
          
        ))}
      </PostsRender>

    </Timeline>
</Container>
);
}

const PostsRender = styled.ul`
  width: 100%;
  margin-top: 10px;
  
  li{
   
    }

    

`;

const ShareBar = styled.ul`
  width: 100%;
  height: 180px;
  background-color: white;
  position: relative;
  font-family:Lato;
  
 form{
  font-family: Lato;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap:3px;
  
  ::placeholder{
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
    background-color: #EFEFEF;
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
    background-color: #EFEFEF;
    border-color: white;
    color: #707070;
    font-size: 13px;
    font-weight: 300;
    line-height: 16px;
    letter-spacing: 0em;
    text-align: left;

  }
}
  p{
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

  button{
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
`;

const HeaderTime = styled.div`
  h1{
    font-size: 4vh;
    color: #FFFFFF;
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
  position: relative;

  .imgPerfil{
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
    color: #FFFFFF;
    font-family: Passion One;
    font-size: 40px;
    font-weight: 700;
    line-height: 54px;
    letter-spacing: 0.05em;
    text-align: left;

  }
`;

const Container = styled.div`
  display: flex;
  
  flex-direction: column;
  justify-content: baseline;
  background-color: #333333;
  height: 100%;

`;
