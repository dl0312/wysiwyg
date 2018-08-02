import { Editor } from "slate-react";
import { Value } from "slate";

import React from "react";
import initialValue from "./value.json";
import styled from "react-emotion";
import { isKeyHotkey } from "is-hotkey";
import { Button, Icon, Toolbar } from "./Components";
const update = require("immutability-helper");

/**
 * A spacer component.
 *
 * @type {Component}
 */

const Spacer = styled("div")`
  height: 20px;
  background-color: #eee;
  margin: 20px -20px;
`;

/**
 * A simple editor component to demo syncing with.
 *
 * @type {Component}
 */

class SyncingEditor extends React.Component {
  onChange = change => {
    this.props.onChange(this.props.index, change.value);
  };
  render() {
    return (
      <div>
        <Editor
          placeholder="Enter some text..."
          value={this.props.value}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

class Wiki extends React.Component {
  state = {
    posts: [
      { value: Value.fromJSON(initialValue) },
      { value: Value.fromJSON(initialValue) }
    ]
  };

  onChange = (index, value) => {
    this.setState(
      update(this.state, {
        posts: {
          [index]: {
            value: {
              $set: value
            }
          }
        }
      })
    );
  };

  render() {
    return (
      <div>
        <SyncingEditor
          index={0}
          onChange={this.onChange}
          value={this.state.posts[0].value}
        />
        <Spacer />
        <SyncingEditor
          index={1}
          onChange={this.onChange}
          value={this.state.posts[1].value}
        />
      </div>
    );
  }
}

/**
 * Export.
 */

export default Wiki;
