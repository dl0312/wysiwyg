import React, { Component, Fragment } from "react";
import styles from "./BlockOptions.scss";

class BlockOptions extends Component {
  showOptions = () => {
    const {
      selectedIndex,
      selectedContent,
      showSelected,
      handleOnChange,
      OnChangeCards,
      imageSrc
    } = this.props;
    // console.log(this.props.selectedContent.content);
    if (selectedIndex.length === 2 || selectedIndex.length === 3) {
      switch (selectedContent.content) {
        case "BUTTON":
          return (
            <div className={styles.optionRows}>
              <div className={styles.option}>
                <div className={styles.optionHeader}>
                  <div className={styles.optionTitle}>LINK</div>
                  <button className={styles.btn}>
                    <i className="fas fa-angle-up" />
                  </button>
                </div>
                <div className={styles.featureColumn}>
                  <div className={styles.btnLinkColumn}>
                    <div className={styles.title}>Button Link</div>
                  </div>
                  <div className={styles.urlColumn}>
                    <button className={styles.btn}>URL</button>
                    <input className={styles.input} type="text" />
                  </div>
                </div>
              </div>
              <div className={styles.option}>
                <div className={styles.optionHeader}>
                  <div className={styles.optionTitle}>COLORS</div>
                  <button className={styles.btn}>
                    <i className="fas fa-angle-up" />
                  </button>
                </div>
                <div className={styles.featureColumn}>
                  <div className={styles.colorsColumn}>
                    <div className={styles.item}>
                      <div className={styles.title}>Text Color</div>
                      <div className={styles.color}>ㅁ</div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.title}>Background Color</div>
                      <div className={styles.color}>ㅁ</div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.title}>Hover Color</div>
                      <div className={styles.color}>ㅁ</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.option}>
                <div className={styles.optionHeader}>
                  <div className={styles.optionTitle}>SPACING</div>
                  <button className={styles.btn}>
                    <i className="fas fa-angle-up" />
                  </button>
                </div>
                <div className={styles.featureColumn}>
                  <div className={styles.alignmentsColumn}>
                    <div className={styles.title}>Alignments</div>
                    <div className={styles.alignColumn}>
                      <button className={styles.align}>
                        <i className="fas fa-align-left" />
                      </button>
                      <button className={styles.align}>
                        <i className="fas fa-align-center" />
                      </button>
                      <button className={styles.align}>
                        <i className="fas fa-align-right" />
                      </button>
                    </div>
                  </div>
                  <div className={styles.lineHeightColumn}>
                    <div className={styles.title}>Line Height</div>
                    <div className={styles.alignColumn}>
                      <button className={styles.align}>
                        <i className="fas fa-align-left" />
                      </button>
                      <button className={styles.align}>
                        <i className="fas fa-align-center" />
                      </button>
                      <button className={styles.align}>
                        <i className="fas fa-align-right" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.option}>
                <div className={styles.optionHeader}>
                  <div className={styles.optionTitle}>GENERAL</div>
                  <button className={styles.btn}>
                    <i className="fas fa-angle-up" />
                  </button>
                </div>
                <div className={styles.featureColumn}>
                  <div className={styles.btnLinkColumn}>
                    <div className={styles.title}>Button Link</div>
                    <div className={styles.case}>Same Tag</div>
                  </div>
                  <div className={styles.urlColumn}>
                    <button className={styles.btn}>URL</button>
                    <input type="text" />
                  </div>
                </div>
              </div>
            </div>
          );
        case "TEXT":
          return (
            <div className={styles.optionRows}>
              <div className={styles.option}>
                <div className={styles.optionHeader}>
                  <div className={styles.optionTitle}>TEXT</div>
                  <button className={styles.btn}>
                    <i className="fas fa-angle-up" />
                  </button>
                </div>
                <div className={styles.featureColumn}>
                  <div className={styles.btnLinkColumn}>
                    <div className={styles.title}>Image URL</div>
                  </div>
                  <div className={styles.urlColumn}>
                    <input
                      style={{ borderRadius: "5px" }}
                      className={styles.input}
                      type="text"
                      value={showSelected(selectedIndex).imageSrc}
                      onChange={e =>
                        handleOnChange(e.target, selectedIndex, "IMAGE", "URL")
                      }
                    />
                  </div>
                  <div className={styles.alignmentsColumn}>
                    <div className={styles.title}>Alignments</div>
                    <div className={styles.alignColumn}>
                      <button
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "flex-start")
                        }
                        className={styles.align}
                      >
                        <i className="fas fa-align-left" />
                      </button>
                      <button
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "center")
                        }
                        className={styles.align}
                      >
                        <i className="fas fa-align-center" />
                      </button>
                      <button
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "flex-end")
                        }
                        className={styles.align}
                      >
                        <i className="fas fa-align-right" />
                      </button>
                    </div>
                  </div>
                  <div className={styles.fullWidthColumn}>
                    <div className={styles.title}>Full Width</div>
                    <div className={styles.buttonColumn}>
                      <label className={styles.switch}>
                        <input
                          onClick={() =>
                            OnChangeCards(selectedIndex, "fullWidth", "toggle")
                          }
                          type="checkbox"
                        />
                        <span className={styles.sliderRound} />
                      </label>
                    </div>
                  </div>
                  <div className={styles.btnLinkColumn}>
                    <div className={styles.title}>Alternate Text</div>
                  </div>
                  <div className={styles.urlColumn}>
                    <input
                      style={{ borderRadius: "5px" }}
                      className={styles.input}
                      type="text"
                      value={showSelected(selectedIndex).alt}
                      onChange={e =>
                        handleOnChange(e.target, selectedIndex, "IMAGE", "ALT")
                      }
                    />
                  </div>
                  <div className={styles.btnLinkColumn}>
                    <div className={styles.title}>Image URL</div>
                  </div>
                  <div className={styles.urlColumn}>
                    <button className={styles.btn}>URL</button>
                    <input
                      className={styles.input}
                      type="text"
                      value={showSelected(selectedIndex).url}
                      onChange={e =>
                        handleOnChange(e.target, selectedIndex, "IMAGE", "LINK")
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        case "IMAGE":
          return (
            <div className={styles.optionRows}>
              <div className={styles.option}>
                <div className={styles.optionHeader}>
                  <div className={styles.optionTitle}>IMAGE</div>
                  <button className={styles.btn}>
                    <i className="fas fa-angle-up" />
                  </button>
                </div>
                <div className={styles.featureColumn}>
                  <div className={styles.btnLinkColumn}>
                    <div className={styles.title}>Image URL</div>
                  </div>
                  <div className={styles.urlColumn}>
                    <input
                      style={{ borderRadius: "5px" }}
                      className={styles.input}
                      type="text"
                      value={showSelected(selectedIndex).imageSrc}
                      onChange={e =>
                        handleOnChange(e.target, selectedIndex, "IMAGE", "URL")
                      }
                    />
                  </div>
                  <div className={styles.alignmentsColumn}>
                    <div className={styles.title}>Alignments</div>
                    <div className={styles.alignColumn}>
                      <button
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "flex-start")
                        }
                        className={styles.align}
                      >
                        <i className="fas fa-align-left" />
                      </button>
                      <button
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "center")
                        }
                        className={styles.align}
                      >
                        <i className="fas fa-align-center" />
                      </button>
                      <button
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "flex-end")
                        }
                        className={styles.align}
                      >
                        <i className="fas fa-align-right" />
                      </button>
                    </div>
                  </div>
                  <div className={styles.fullWidthColumn}>
                    <div className={styles.title}>Full Width</div>
                    <div className={styles.buttonColumn}>
                      <label className={styles.switch}>
                        <input
                          onClick={() =>
                            OnChangeCards(selectedIndex, "fullWidth", "toggle")
                          }
                          type="checkbox"
                        />
                        <span class={styles.sliderRound} />
                      </label>
                    </div>
                  </div>
                  <div className={styles.btnLinkColumn}>
                    <div className={styles.title}>Alternate Text</div>
                  </div>
                  <div className={styles.urlColumn}>
                    <input
                      style={{ borderRadius: "5px" }}
                      className={styles.input}
                      type="text"
                      value={showSelected(selectedIndex).alt}
                      onChange={e =>
                        handleOnChange(e.target, selectedIndex, "IMAGE", "ALT")
                      }
                    />
                  </div>
                  <div className={styles.btnLinkColumn}>
                    <div className={styles.title}>Image URL</div>
                  </div>
                  <div className={styles.urlColumn}>
                    <button className={styles.btn}>URL</button>
                    <input
                      className={styles.input}
                      type="text"
                      value={showSelected(selectedIndex).url}
                      onChange={e =>
                        handleOnChange(e.target, selectedIndex, "IMAGE", "LINK")
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        case "VIDEO":
          return (
            <div className={styles.optionRows}>
              <div className={styles.option}>
                <div className={styles.optionHeader}>
                  <div className={styles.optionTitle}>VIDEO</div>
                  <button className={styles.btn}>
                    <i className="fas fa-angle-up" />
                  </button>
                </div>
                <div className={styles.featureColumn}>
                  <div className={styles.btnLinkColumn}>
                    <div className={styles.title}>Video URL</div>
                  </div>
                  <div className={styles.urlColumn}>
                    <button className={styles.btn}>URL</button>
                    <input
                      className={styles.input}
                      type="text"
                      value={showSelected(selectedIndex).videoSrc}
                      onChange={e =>
                        handleOnChange(e.target, selectedIndex, "VIDEO", "URL")
                      }
                    />
                  </div>
                  <div className={styles.alignmentsColumn}>
                    <div className={styles.title}>Alignments</div>
                    <div className={styles.alignColumn}>
                      <button
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "flex-start")
                        }
                        className={styles.align}
                      >
                        <i className="fas fa-align-left" />
                      </button>
                      <button
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "center")
                        }
                        className={styles.align}
                      >
                        <i className="fas fa-align-center" />
                      </button>
                      <button
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "flex-end")
                        }
                        className={styles.align}
                      >
                        <i className="fas fa-align-right" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return null;
      }
    }
  };

  render() {
    return (
      <div
        style={{
          top:
            this.props.selectedContent === null ||
            this.props.selectedContent === undefined
              ? "900px"
              : "45px",
          height: "90vh",
          opacity:
            this.props.selectedContent === null ||
            this.props.selectedContent === undefined
              ? "0"
              : "1"
        }}
        className={styles.blockOption}
      >
        <div className={styles.header}>
          <div className={styles.blockName}>CONTENT</div>
          <div className={styles.btnColumn}>
            <button className={styles.btn}>
              <i className="fas fa-trash-alt" />
            </button>
            <button className={styles.btn}>
              <i className="fas fa-copy" />
            </button>
            <button className={styles.btn}>
              <i className="fas fa-angle-down" />
            </button>
          </div>
        </div>
        {this.props.selectedContent ? this.showOptions() : null}
      </div>
    );
  }
}

export default BlockOptions;
