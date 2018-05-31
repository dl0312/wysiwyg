import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Ionicon from "react-ionicons";
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
                  GUIDE
                </NavLink>
                <NavLink to="/wiki" className={styles.menuItem}>
                  WIKI
                </NavLink>
                <NavLink to="/store" className={styles.menuItem}>
                  STORE
                </NavLink>
                <NavLink to="/undefined" className={styles.menuItem}>
                  UNDEFINED
                </NavLink>
              </ul>
            </div>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.userColumn}>
              <ul className={styles.userMenu}>
                <li className={styles.menuItem}>
                  <i class="fas fa-bell" />
                </li>
                <NavLink to="/profile" className={styles.menuItem}>
                  <i class="fas fa-user-circle" />
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
