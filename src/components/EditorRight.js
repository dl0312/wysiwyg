import React, { Component } from "react";
import styles from "./EditorRight.scss";

class EditorRight extends Component {
  state = {
    active: 0,
    hover: null
  };

  toggle = position => {
    if (this.state.active === position) {
      this.setState({ active: null });
    } else {
      this.setState({ active: position });
    }
  };

  hover = position => {
    if (this.state.hover === position) {
      this.setState({ hover: null });
    } else {
      this.setState({ hover: position });
    }
  };

  leave = position => {
    if (this.state.hover === position) {
      this.setState({ hover: null });
    }
  };

  myColor = position => {
    if (this.state.active === position) {
      return "#fafafa";
    }
    if (this.state.hover === position) {
      return "#c0c5c9";
    }
    return "";
  };

  fontColor = position => {
    if (this.state.active === position) {
      return "#505659";
    }
    if (this.state.hover === position) {
      return "#505659";
    }
    return "";
  };

  showSection = () => {
    switch (this.state.active) {
      case 0:
        return <Content />;
        break;
      case 1:
        return <Row />;
        break;
      case 2:
        return <Body />;
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div className={styles.editorRight}>
        <ul className={styles.menuColumn}>
          <li
            style={{ background: this.myColor(0), color: this.fontColor(0) }}
            onClick={() => {
              this.toggle(0);
            }}
            onMouseOver={() => {
              this.hover(0);
            }}
            onMouseLeave={() => {
              this.leave(0);
            }}
            className={styles.menuItem}
          >
            <div className={styles.icon}>
              <i class="fas fa-th-large" />
            </div>
            <div className={styles.title}>CONTENT</div>
          </li>
          <li
            style={{ background: this.myColor(1), color: this.fontColor(1) }}
            onClick={() => {
              this.toggle(1);
            }}
            onMouseOver={() => {
              this.hover(1);
            }}
            onMouseLeave={() => {
              this.leave(1);
            }}
            className={styles.menuItem}
          >
            <div className={styles.icon}>
              <i class="fas fa-bars" />
            </div>
            <div className={styles.title}>ROW</div>
          </li>
          <li
            style={{ background: this.myColor(2), color: this.fontColor(2) }}
            onClick={() => {
              this.toggle(2);
            }}
            onMouseOver={() => {
              this.hover(2);
            }}
            onMouseLeave={() => {
              this.leave(2);
            }}
            className={styles.menuItem}
          >
            <div className={styles.icon}>
              <i class="fas fa-columns" />
            </div>
            <div className={styles.title}>BODY</div>
          </li>
        </ul>
        {this.showSection()}
      </div>
    );
  }
}

const Content = () => {
  return (
    <div className={styles.contentBody}>
      <ul className={styles.contentColumn}>
        <li className={styles.item}>
          <div className={styles.icon}>
            <i class="fas fa-square" />
          </div>
          <div className={styles.title}>BUTTON</div>
        </li>
        <li className={styles.item}>
          <div className={styles.icon}>
            <i class="fas fa-divide" />
          </div>
          <div className={styles.title}>DIVIDER</div>
        </li>
        <li className={styles.item}>
          <div className={styles.icon}>
            <i class="fas fa-code" />
          </div>
          <div className={styles.title}>HTML</div>
        </li>
        <li className={styles.item}>
          <div className={styles.icon}>
            <i class="far fa-image" />
          </div>
          <div className={styles.title}>IMGAE</div>
        </li>
        <li className={styles.item}>
          <div className={styles.icon}>
            <i class="fas fa-font" />
          </div>
          <div className={styles.title}>TEXT</div>
        </li>
      </ul>
    </div>
  );
};

const Row = () => {
  return (
    <div className={styles.rowBody}>
      <div className={styles.rowRow}>
        <div className={styles.item}>
          <div className={styles.box} />
        </div>
        <div className={styles.item}>
          <div className={styles.box} />
          <div className={styles.box} />
        </div>
        <div className={styles.item}>
          <div className={styles.box} />
          <div className={styles.box} />
          <div className={styles.box} />
        </div>
        <div className={styles.item}>
          <div className={styles.box} />
          <div className={styles.box} />
          <div className={styles.box} />
          <div className={styles.box} />
        </div>
        <div className={styles.item}>
          <div className={styles.box} />
          <div className={styles.box} />
        </div>
        <div className={styles.item}>
          <div className={styles.box} />
          <div className={styles.box} />
        </div>
        <div className={styles.item}>
          <div className={styles.box} />
          <div className={styles.box} />
          <div className={styles.box} />
          <div className={styles.box} />
        </div>
      </div>
    </div>
  );
};

const Body = () => {
  return <div className={styles.bodyBody} />;
};

export default EditorRight;
