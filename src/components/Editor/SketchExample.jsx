import React from "react";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

export default class SketchExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
      color: this.props.color
    };
  }

  componentWillReceiveProps = nextprops => {
    this.setState({ color: nextprops.color });
  };

  handleOnClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
    if (this.props.type === "BodyBackgroundColor") {
      this.props.masterCallback(this.props.type, this.state.color);
    } else {
      this.props.OnChangeCards(
        this.props.selectedIndex,
        this.props.type,
        this.state.color
      );
    }
  };

  handleFontOnClick = event => {
    event.preventDefault();
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = color => {
    if (this.props.type === "BodyBackgroundColor") {
      this.setState({ color: color.rgb }, () =>
        this.props.masterCallback(this.props.type, this.state.color)
      );
    } else {
      this.setState({ color: color.rgb }, () =>
        this.props.OnChangeCards(
          this.props.selectedIndex,
          this.props.type,
          this.state.color
        )
      );
    }
  };

  handleFontChange = (color, event) => {
    this.setState({ color: color.rgb }, () =>
      this.props.onChange(event, this.props.type, color)
    );
  };

  render() {
    const styles = reactCSS({
      default: {
        fontColor: {
          padding: "13px 10px",
          color: `rgba(${this.state.color.r}, ${this.state.color.g}, ${
            this.state.color.b
          }, ${this.state.color.a})`
        },
        color: {
          width: "36px",
          height: "14px",
          borderRadius: "2px",
          background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${
            this.state.color.b
          }, ${this.state.color.a})`
        },
        swatch: {
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer"
        },
        popover: {
          position: "absolute",
          marginTop: "5px",
          marginLeft: "-175px",
          zIndex: "2"
        },
        cover: {
          position: "relative",
          top: "0px",
          right: "100px",
          bottom: "0px",
          left: "0px"
        }
      }
    });
    if (this.props.type === "font-color") {
      return (
        <div>
          <i
            className="fas fa-font"
            style={styles.fontColor}
            onMouseDown={this.handleFontOnClick}
          />
          {this.state.displayColorPicker ? (
            <div style={styles.popover}>
              <div style={styles.cover} onMouseDown={this.handleClose} />
              <SketchPicker
                color={this.state.color}
                onChange={this.handleFontChange}
              />
            </div>
          ) : null}
        </div>
      );
    }
    return (
      <div>
        <div style={styles.swatch} onClick={this.handleOnClick}>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <SketchPicker
              color={this.state.color}
              onChange={this.handleChange}
            />
          </div>
        ) : null}
      </div>
    );
  }
}
