import React, { Component } from "react";
import PropTypes from "prop-types";
import ItemTypes from "./ItemTypes";
import EditorDefaults from "./EditorDefaults";
import { DragSource } from "react-dnd";
import { Value } from "slate";
import styled from "styled-components";

const Item = styled.li`
  cursor: -webkit-grab;
  border: 0.5px solid #d8d8d8;
  border-radius: 5px;
  height: 115px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: box-shadow 0.2s ease;
  opacity: ${props => props.opacity};
  background-color: white;
  &:hover {
    -webkit-box-shadow: 0 6px 10px rgba(0, 0, 0, 0.35);
    -moz-box-shadow: 0 6px 10px rgba(0, 0, 0, 0.35);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.35);
  }
`;

const Icon = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
`;

const Title = styled.div`
  font-size: 12px;
  font-weight: 600;
`;

const itemSource = {
  beginDrag(props) {
    props.masterCallback("OnDrag", "content");

    const item = {
      type: "content",
      OnDrag: "content",
      content: props.item.name
    };
    // default block content src, text etc...
    switch (props.item.name) {
      case "IMAGE":
        item.imageSrc = EditorDefaults.IMG;
        item.fullWidth = false;
        item.alt = "Image";
        break;
      case "VIDEO":
        item.videoSrc = EditorDefaults.VIDEO;
        break;
      case "BUTTON":
        item.textColor = EditorDefaults.BUTTON_TEXT_COLOR;
        item.backgroundColor = EditorDefaults.BUTTON_BACKGROUND_COLOR;
        item.hoverColor = EditorDefaults.BUTTON_HOVER_COLOR;
        item.link = "http://localhost:3000";
        item.value = Value.fromJSON({
          object: "value",
          document: {
            object: "document",
            data: {},
            nodes: [
              {
                object: "block",
                type: "paragraph",
                isVoid: false,
                data: {},
                nodes: [
                  {
                    object: "text",
                    leaves: [
                      {
                        object: "leaf",
                        text: "CLICK ME!",
                        marks: [
                          {
                            object: "mark",
                            type: "font-color",
                            data: {
                              fontColor: {
                                hsl: {
                                  h: 0,
                                  s: 0,
                                  l: 1,
                                  a: 1
                                },
                                hex: "#ffffff",
                                rgb: {
                                  r: 255,
                                  g: 255,
                                  b: 255,
                                  a: 1
                                },
                                hsv: {
                                  h: 0,
                                  s: 0,
                                  v: 1,
                                  a: 1
                                },
                                oldHue: 0,
                                source: "rgb"
                              }
                            }
                          }
                        ]
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
        item.textColor = EditorDefaults.TEXT_TEXT_COLOR;
        item.backgroundColor = EditorDefaults.TEXT_BACKGROUND_COLOR;
        item.value = Value.fromJSON({
          object: "value",
          document: {
            object: "document",
            data: {},
            nodes: [
              {
                object: "block",
                type: "paragraph",
                isVoid: false,
                data: {},
                nodes: [
                  {
                    object: "text",
                    leaves: [
                      {
                        object: "leaf",
                        text: "A line of text in a paragraph.",
                        marks: [
                          {
                            object: "mark",
                            type: "font-size",
                            data: {
                              fontSize: 16
                            }
                          },
                          {
                            object: "mark",
                            type: "font-family",
                            data: {
                              fontFamily: "Nanum Gothic"
                            }
                          },
                          {
                            object: "mark",
                            type: "font-color",
                            data: {
                              fontColor: {
                                hsl: {
                                  h: 209.99999999999997,
                                  s: 0,
                                  l: 0,
                                  a: 1
                                },
                                hex: "#000000",
                                rgb: {
                                  r: 0,
                                  g: 0,
                                  b: 0,
                                  a: 1
                                },
                                hsv: {
                                  h: 209.99999999999997,
                                  s: 0,
                                  v: 0,
                                  a: 1
                                },
                                oldHue: 209.99999999999997,
                                source: "rgb"
                              }
                            }
                          }
                        ]
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
                        text: EditorDefaults.HTML
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
    props.masterCallback("OnDrag", null);
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
        <div>
          <Item opacity={opacity}>
            <Icon className={icon} />
            <Title>{name}</Title>
          </Item>
        </div>
      )
    );
  }
}

export default DragSource(ItemTypes.CONTENT, itemSource, connect => ({
  connectDragSource: connect.dragSource()
}))(ContentItem);
