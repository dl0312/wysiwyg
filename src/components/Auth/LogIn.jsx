import React from "react";
import styled from "styled-components";
import { graphql, compose, Mutation } from "react-apollo";
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "../../queries.js";
import { Link } from "react-router-dom";
import { AUTH_TOKEN } from "../../constants";

const LoginContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px;
`;

const RealLoginContainer = styled.div`
  border: 0.5px solid grey;
  padding: 20px;
`;

const LoginTitle = styled.div``;

const SearchInput = styled.input`
  width: 100%;
  margin-bottom: 30px;
  padding: 0 10px;
  height: 30px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  &:focus {
    outline: none;
  }
`;

const ButtonContainer = styled.div``;

const Button = styled.button`
  width: 100%;
  height: 30px;
  margin: 2px 0;
`;

class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true,
      nickName: "",
      email: "",
      password: "",
      phoneNumber: ""
    };
  }

  _confirm = async data => {
    console.log(data);
    const { token } = this.state.login ? data.EmailSignIn : data.EmailSignUp;
    this._saveUserData(token);
  };

  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  render() {
    const { email, password, login, nickName, phoneNumber } = this.state;
    return (
      <LoginContainer>
        <RealLoginContainer>
          {login ? (
            <React.Fragment>
              <LoginTitle>E-MAIL</LoginTitle>
              <SearchInput
                type="text"
                onChange={e =>
                  this.setState({
                    email: e.target.value
                  })
                }
                placeholder="Your email address"
              />
              <LoginTitle>PASSWORD</LoginTitle>
              <SearchInput
                type="text"
                onChange={e =>
                  this.setState({
                    password: e.target.value
                  })
                }
                placeholder="password"
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <LoginTitle>NICKNAME</LoginTitle>
              <SearchInput
                type="text"
                onChange={e =>
                  this.setState({
                    nickName: e.target.value
                  })
                }
              />
              <LoginTitle>E-MAIL</LoginTitle>
              <SearchInput
                type="text"
                onChange={e =>
                  this.setState({
                    email: e.target.value
                  })
                }
              />
              <LoginTitle>PASSWORD</LoginTitle>
              <SearchInput
                type="text"
                onChange={e =>
                  this.setState({
                    password: e.target.value
                  })
                }
              />
              <LoginTitle>PHONENUMBER</LoginTitle>
              <SearchInput
                type="text"
                onChange={e =>
                  this.setState({
                    phoneNumber: e.target.value
                  })
                }
              />
            </React.Fragment>
          )}
          <ButtonContainer>
            <Mutation
              mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
              variables={{ email, password, nickName, phoneNumber }}
              onCompleted={data => this._confirm(data)}
            >
              {mutation => (
                <Button onClick={() => mutation}>
                  {login ? "login" : "create account"}
                </Button>
              )}
            </Mutation>
            <Button onClick={() => this.setState({ login: !login })}>
              {login
                ? "need to create an account?"
                : "already have an account?"}
            </Button>
          </ButtonContainer>
        </RealLoginContainer>
      </LoginContainer>
    );
  }
}

export default LogIn;
