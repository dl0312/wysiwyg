import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const NavContainer = styled.div`
  width: 100%;
  height: 100px;
  z-index: 200;
  border-bottom: 0.1px solid darkgrey;
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  color: black;
  background-color: #fafafa;
  transition: background-color 0.1s ease;
  background-color: transparent;
`;

const MenuList = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-top: 0.1px solid darkgrey;
`;

const MenuItem = styled.div`
  text-align: center;
  padding: 9px 30px;
  color: black;
  text-decoration: none;
  font-family: Raleway;
`;

class Navigation extends Component {
  state = {
    search: false
  };

  render() {
    return (
      <NavContainer>
        <Header>
          <div style={{ width: "100%" }}>
            <NavLink
              to="/"
              style={{
                fontSize: "50px",
                textDecoration: "none"
              }}
            >
              <MenuItem
                style={{
                  color: "purple",
                  fontFamily: "Hanalei Fill, cursive",
                  textShadow: "3px 3px #ff0000"
                }}
              >
                CLAP
              </MenuItem>
              {/* <MenuList>
                  <MenuItem style={{ fontSize: "20px" }}>
                    <i className="fas fa-bell" />
                  </MenuItem>
                  <NavLink to="/profile" style={{ textDecoration: "none" }}>
                    <MenuItem style={{ fontSize: "20px" }}>
                      <i className="fas fa-user-circle" />
                    </MenuItem>
                  </NavLink>
                </MenuList> */}
            </NavLink>
            <MenuList>
              <NavLink to="/guide" style={{ textDecoration: "none" }}>
                <MenuItem>GUIDE</MenuItem>
              </NavLink>
              <NavLink to="/wiki" style={{ textDecoration: "none" }}>
                <MenuItem>WIKI</MenuItem>
              </NavLink>
              <NavLink to="/store" style={{ textDecoration: "none" }}>
                <MenuItem>STORE</MenuItem>
              </NavLink>
              <NavLink to="/editor" style={{ textDecoration: "none" }}>
                <MenuItem>EDITOR</MenuItem>
              </NavLink>
            </MenuList>
          </div>
        </Header>
      </NavContainer>
    );
  }
}

export default Navigation;
