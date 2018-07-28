import React, { Component } from "react";
import styles from "./Store.scss";
import ShowWindow from "./ShowWindow";
import styled from "styled-components";

const StoreContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 30px;
  font-family: "Open Sans", sans-serif;
`;

class Store extends Component {
  render() {
    return (
      <StoreContainer>
        <ShowWindow />
      </StoreContainer>
    );
  }
}

class Showcase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: null
    };
  }

  handleOnMouseEnter = position => {
    this.setState({ activeItem: position });
  };

  handleOnMouseLeave = position => {
    this.setState({ activeItem: null });
  };

  detectPosition = num => {
    if (this.state.activeItem == null) return "";
    else if (num < this.state.activeItem) return "translateX(-10%)";
    else if (num > this.state.activeItem) return "translateX(+10%)";
    else return "";
  };

  render() {
    return (
      <div className={styles.itemColumn}>
        <div
          style={{ transform: this.detectPosition(1) }}
          onMouseEnter={() => this.handleOnMouseEnter(1)}
          onMouseLeave={() => this.handleOnMouseLeave(1)}
          className={styles.item}
        >
          <img
            src="http://news.cdn.leagueoflegends.com/public/images/misc/Background.jpg"
            alt="LOL"
            className={styles.image}
          />
          <div className={styles.text}>League Of Legends</div>
        </div>
        <div
          style={{ transform: this.detectPosition(2) }}
          onMouseEnter={() => this.handleOnMouseEnter(2)}
          onMouseLeave={() => this.handleOnMouseLeave(2)}
          className={styles.item}
        >
          <img
            src="http://cdn2us.denofgeek.com/sites/denofgeekus/files/styles/main_wide/public/world_of_warcraft_ps3.jpg?itok=hxJ0mkck"
            alt="WOW"
            className={styles.image}
          />
          <div className={styles.text}>World Of Warcreft</div>
        </div>
        <div
          style={{ transform: this.detectPosition(3) }}
          onMouseEnter={() => this.handleOnMouseEnter(3)}
          onMouseLeave={() => this.handleOnMouseLeave(3)}
          className={styles.item}
        >
          <img
            src="http://img.ruliweb.com/data/news17/10m/10/multi/nexonm13.jpg"
            alt="DNF"
            className={styles.image}
          />
          <div className={styles.text}>Dungeon & Fighters</div>
        </div>
      </div>
    );
  }
}

export default Store;
