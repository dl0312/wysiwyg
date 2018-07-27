import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navigation.scss";

class Navigation extends Component {
  state = {
    backgroundcolor: "transparent",
    search: false
  };

  render() {
    return (
      <div className={styles.navigation}>
        <header className={styles.header} style={this.backgroundcolor}>
          <div className={styles.leftSection}>
            <div className={styles.menuColumn}>
              <ul className={styles.menuList}>
                <NavLink to="/" className={styles.logo}>
                  <div className={styles.logoTitle}>CLAP</div>
                </NavLink>
                <NavLink to="/guide" className={styles.menuItem}>
                  <div className={styles.menuTitle}>GUIDE</div>
                </NavLink>
                <NavLink to="/wiki" className={styles.menuItem}>
                  <div className={styles.menuTitle}>WIKI</div>
                </NavLink>
                <NavLink to="/store" className={styles.menuItem}>
                  <div className={styles.menuTitle}>STORE</div>
                </NavLink>
                <NavLink to="/undefined" className={styles.menuItem}>
                  <div className={styles.menuTitle}>UNDEFINED</div>
                </NavLink>
              </ul>
            </div>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.userColumn}>
              <ul className={styles.userMenu}>
                <li className={styles.menuItem}>
                  <i className="fas fa-bell" />
                </li>
                <NavLink to="/profile" className={styles.menuItem}>
                  <i className="fas fa-user-circle" />
                </NavLink>
              </ul>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default Navigation;
