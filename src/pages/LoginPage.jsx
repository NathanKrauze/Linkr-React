import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);

  const navigate = useNavigate();

  async function signIn(e) {
    e.preventDefault();

    setBtnDisabled(true);

    const newLogin = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/signin`,
        newLogin
      );

      console.log(response.data);
      const { token, idUser, username, pictureUrl } = response.data;
      localStorage.setItem(
        "user",
        JSON.stringify({ token, idUser, username, pictureUrl })
      );

      navigate("/timeline");
    } catch (error) {
      console.error("Error: ", error);
      setBtnDisabled(false);

      if (error.response) {
        alert(error.response.data);
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  }

  return (
    <Container>
      <Logo>
        <h1>linkr</h1>
        <p>save, share and discover the best links on the web</p>
      </Logo>
      <SingInContainer>
        <form onSubmit={signIn}>
          <input
            data-test="email"
            placeholder="e-mail"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            data-test="password"
            placeholder="password"
            type="password"
            autoComplete="new-password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button data-test="login-btn" type="submit" disabled={btnDisabled}>
            Log In
          </button>
        </form>

        <Link to="/signup">
          <h2 data-test="sign-up-link">First time? Create an account!</h2>
        </Link>
      </SingInContainer>
    </Container>
  );
}

const SingInContainer = styled.section`
  flex: 37;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #333333;

  button {
    width: calc(100% - 167px);
  }

  h2 {
    font-family: Lato;
    font-size: 20px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0em;
    color: #ffffff;
  }

  @media (max-width: 767px) {
    width: 100%;
    height: 100vh;
    flex: 75;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 63px;

    button {
      width: calc(100% - 12.7%);
    }

    input {
      width: calc(100% - 18%);
    }

    h2 {
      font-family: Lato;
      font-size: 17px;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: 0em;
    }
  }
`;

const Logo = styled.section`
  flex: 63;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #151515;
  height: 100vh;

  h1 {
    width: 442px;
    height: 117px;
    font-family: Passion One;
    font-size: 106px;
    font-weight: 700;
    line-height: 117px;
    letter-spacing: 0.05em;
    text-align: left;
    color: #ffffff;
  }

  p {
    width: 442px;
    height: 128px;
    font-family: Oswald;
    font-size: 43px;
    font-weight: 700;
    line-height: 64px;
    letter-spacing: 0em;
    text-align: left;
    color: #ffffff;
  }
  @media (max-width: 767px) {
    width: 100%;
    height: 175px;
    flex: 25;

    p {
      width: 237px;
      height: 68px;
      font-family: Oswald;
      font-size: 23px;
      font-weight: 700;
      line-height: 34px;
      letter-spacing: 0em;
      text-align: center;
    }

    h1 {
      width: 167px;
      height: 84px;
      font-family: Passion One;
      font-size: 76px;
      font-weight: 700;
      line-height: 84px;
      letter-spacing: 0.05em;
      text-align: left;
    }
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  background-color: #333333;

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
`;
