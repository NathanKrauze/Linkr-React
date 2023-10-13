import styled from "styled-components";

export default function EachPost ({prop}){
    // implementar funcionaidade de curtida
    function curtirPost(e){
        e.preventDefault();
      }


    return(
        <TimelineList>
        <div className="sideBarPost">
        <Image data = {prop.pictureUrl}></Image>
        <ion-icon name="heart-outline" onClick={curtirPost}></ion-icon>
        <p>13 likes</p>
        </div>

        <div className="contentPost">
        <p>{prop.username}</p>
        <p className="postText">{prop.postText}</p>
        <div className="urlPost">{prop.postUrl}</div>
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

    .urlPost{
      margin-top: 10px;
      width: 288px;
      height: 115px;
      border-radius: 10px;
      border: 1px solid  #4D4D4D;
      padding: 5px;
      box-sizing: border-box;
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








