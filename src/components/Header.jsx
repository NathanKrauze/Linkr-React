import styled from "styled-components";
import { AuthContext } from "../contexts/authContext";
import { FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";
import { useContext, useState } from "react";
import { DebounceInput } from 'react-debounce-input';
import apiAuth from "../services/apiAuth";
import { useNavigate } from "react-router-dom";


export default function Header() {
  const { logout, modalOpen, setModalOpen } = useContext(AuthContext);
  const user = localStorage.getItem("user");
  const myObj = JSON.parse(user);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [hideSearch, setHideSearch] = useState(true)

  const navigate = useNavigate()

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  function searchUsers(e) {
    if(e.target.value.length > 2){
      const searchString = e.target.value + '%';
      setSearch(e.target.value)
      apiAuth.getSearchUsers(searchString, myObj.token)
        .then(res => {
          setUsers(res.data)
          setHideSearch(false)
        })
        .catch(err => alert(err.response.data))
    }else{
      setUsers([])
      setHideSearch(true)
    }
  }

  return (
    <StyledHeader pic={myObj ? myObj.pictureUrl : ""} hide={hideSearch}>
      <h1>linkr</h1>
      <div className="searchBox" >
        <DebounceInput
          minLength={3}
          debounceTimeout={300}
          value={search}
          onChange={(e) => searchUsers(e)}
          placeholder={'Search for people'}
          className="debounceInput"
          data-test= "search"
          >
        </DebounceInput>
        <div className="iconBox">
          <FiSearch size={24} color="#C6C6C6" className="iconSearch" />
        </div>
        <ul className="showUsers">
          {users?.map(user=>{
            return(
              <li onClick={()=> navigate(`/user/${user.id}`)} data-test="user-search">
                <img src={user.pictureUrl} alt="userProfile"/>
                <h4>{user.username}</h4>
              </li>
            )
          })}
        </ul>
      </div>
      <ContainerRight>
        <div onClick={toggleModal}>
          <div data-test="avatar" className="imgPerfil"></div>
          <div className="arrow">
            {modalOpen ? (
              <FiChevronDown size={26} color="white" />
            ) : (
              <FiChevronUp size={26} color="white" />
            )}
          </div>
        </div>

        <ModalLogout data-test="menu" modalOpen={modalOpen}>
          <p data-test="logout" onClick={() => logout()}>
            {" "}
            Logout{" "}
          </p>
        </ModalLogout>
      </ContainerRight>
    </StyledHeader>
  );
}

const StyledHeader = styled.section`
  display: flex;
  justify-content: left;
  background-color: #151515;
  height: 49px;
  position: fixed;
  width: 100%;
  z-index: 3;

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

  .searchBox{
    position: absolute;
    top: 6px;
    left: 30vw;

    @media (max-width: 670px){
      top: 70px;
      left: 10px;
      input{
        width: calc(100vw - 30px);
        box-sizing: border-box;
      }
      .showUsers{
        width: calc(100vw - 30px);
      }
    }
    .iconBox{
      position: absolute;
      top: 6px;
      right: 10px;
    }
  }

  input{
    width: 40vw;
    height: 35px;
    box-sizing: border-box;

    &::placeholder{
      color: #C6C6C6;
      font-family: Lato;
      font-size: 19px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }

  .showUsers{
    display: ${(props) => (props.hide ? 'none' : 'inherit')};
    width: 40vw;
    box-sizing: border-box;
    background-color: #E7E7E7;
    margin-top: -10px;
    margin-left: 1px;
    padding: 15px 0 1px 10px;
    border-radius: 4px;
    li{
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }
    img{
      width: 40px;
      height: 40px;
      border-radius: 26.5px;
      background-size: cover;
      background-position: center;
    }
  }
`;

const ContainerRight = styled.div`
  display: flex;
  cursor: pointer;

  .arrow {
    position: absolute;
    right: 55px;
    margin-top: 12px;
  }
`;

const ModalLogout = styled.div`
  display: ${(props) => (props.modalOpen ? "flex" : "none")};
  position: fixed;
  right: 0;
  top: 6%;
  font-family: Lato;
  font-size: 13px;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: 0.05em;
  background-color: #151515;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  color: #ffffff;
  text-align: center;
  padding: 10px 20px;
  cursor: pointer;
`;
