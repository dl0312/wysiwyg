import React, { Component, Fragment } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import styles from "./EditorLeft.scss";

class EditorLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
  }

  onEditorStateChange = editorState => {
    console.log(editorState);
    this.setState({
      editorState
    });
  };

  uploadImageCallBack = file => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.imgur.com/3/image");
      xhr.setRequestHeader("Authorization", "Client-ID XXXXX");
      const data = new FormData();
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  };

  allowDrop = e => {
    e.preventDefault();
  };

  handleOnDrop = e => {
    console.log("ondrop: " + e.object);

    e.preventDefault();
    var data = e.dataTransfer.getData("text/html");
    console.log("data: " + data);
    e.target.children[0].insertAdjacentHTML("beforeend", data);
    // const data = event.dataTransfer.getData("text/plain");
  };

  render() {
    const { editorState } = this.state;
    const raw = convertToRaw(this.state.editorState.getCurrentContent());
    return (
      <Fragment>
        {/* <div className={styles.editor}>
          <Editor
            editorState={editorState}
            onEditorStateChange={this.onEditorStateChange}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            toolbar={{
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true },
              image: {
                uploadCallback: this.uploadImageCallBack,
                alt: { present: true, mandatory: true }
              }
            }}
            onDragOver={this.allowDrop}
            localization={{ locale: "ko" }}
          />
        </div> */}
        <div
          style={{
            background: `rgba(${this.props.color.r}, ${this.props.color.g}, ${
              this.props.color.b
            }, ${this.props.color.a})`
          }}
          className={styles.editor}
          onDragOver={this.allowDrop}
          onDrop={this.handleOnDrop}
        >
          <div
            style={{
              width: "600px"
            }}
            className={styles.practice}
          />
        </div>
        {/* <div className={styles.string}>{JSON.stringify(raw)}</div> */}
      </Fragment>
    );
  }
}

export default EditorLeft;
