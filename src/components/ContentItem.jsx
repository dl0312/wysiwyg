import React, { Component } from "react";
import PropTypes from "prop-types";

import styles from "./ContentItem.scss";

import ItemTypes from "./ItemTypes";
import { DragSource } from "react-dnd";
import { Value } from "slate";

const itemSource = {
  beginDrag(props) {
    console.log("dragging");
    const item = {
      type: "content",
      OnDrag: "content",
      content: props.item.name
    };
    // default block content src, text etc...
    switch (props.item.name) {
      case "IMAGE":
        item.imageSrc =
          "https://media.giphy.com/media/26BoDtH35vKPiELnO/giphy.gif";
        item.fullWidth = false;
        item.alt = "Image";
        break;
      case "VIDEO":
        item.videoSrc = "https://www.youtube.com/embed/TRmdXDH9b1s?ecver=1";
        break;
      case "BUTTON":
        item.value = Value.fromJSON({
          document: {
            nodes: [
              {
                object: "block",
                type: "paragraph",
                nodes: [
                  {
                    object: "text",
                    leaves: [
                      {
                        text: "CLICK ME!"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        });
        break;
      case "TEXT":
        item.value = Value.fromJSON({
          document: {
            nodes: [
              {
                object: "block",
                type: "paragraph",
                nodes: [
                  {
                    object: "text",
                    leaves: [
                      {
                        text: "A line of text in a paragraph."
                      }
                    ]
                  }
                ]
              }
            ]
          }
        });
        break;
      case "HTML":
        item.value = Value.fromJSON({
          document: {
            nodes: [
              {
                object: "block",
                marks: {
                  b: "bold"
                },
                type: "paragraph",
                nodes: [
                  {
                    object: "text",
                    leaves: [
                      {
                        text: "Hello, world!"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        });
        break;
      default:
        break;
    }

    return item;
  },
  endDrag(props, monitor, component) {
    // console.log(`monitor.didDrop(): ${monitor.didDrop()}`);
    // if (!monitor.didDrop()) {
    //   return;
    // }
    const item = {
      type: "content",
      OnDrag: "content",
      content: props.item.name
    };
    return item;
  }
};

class ContentItem extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired
  };
  render() {
    const { icon, name, connectDragSource, isDragging } = this.props;
    const opacity = isDragging ? 0.5 : 1;
    return (
      connectDragSource &&
      connectDragSource(
        <li style={{ opacity }} className={styles.item}>
          <div className={styles.icon}>
            <i className={icon} />
          </div>
          <div className={styles.title}>{name}</div>
        </li>
      )
    );
  }
}

export default DragSource(ItemTypes.CONTENT, itemSource, connect => ({
  connectDragSource: connect.dragSource()
}))(ContentItem);
