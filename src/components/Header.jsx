import styled from "styled-components";
import { AuthContext } from "../contexts/authContext";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useContext } from "react";

export default function Header() {
  const { logout, modalOpen, setModalOpen } = useContext(AuthContext);
  const user = localStorage.getItem("user");
  const myObj = JSON.parse(user);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <StyledHeader pic={myObj ? myObj.pictureUrl : ""}>
      <h1>linkr</h1>
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
