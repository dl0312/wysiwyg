import React from "react";
import db from "./db";

class SearchCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: this.props.searchText
    };
  }
  render() {
    return <div>SearchCategory</div>;
  }
}

export default SearchCategory;
