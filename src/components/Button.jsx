import React, { Component } from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import { Motion, spring } from 'react-motion';

const Wrapper = styled.div``;

const getValue = (val) => typeof val === 'string' ? val : `${val}px`;

const ImageBox = styled.div`
  width: ${(props) => getValue(props.width)};
  height: ${(props) => getValue(props.height)};
  background: url('${(props) => props.image}');
  background-size: cover;
  background-position: center;
`;

const BlackBox = styled.div`
  height: ${(props) => props.heightPercentage}%;
  width: 100%;
  background: #000;
  transform-origin: ${(props) => props.xDirection} center;
`;

class Button extends Component {
  componentWillMount() {
    this.setState({
      startFirstBoxAnimation: false,
      startSecondBoxAnimation: true
    });
  }

  render() {
    const { startFirstBoxAnimation, startSecondBoxAnimation } = this.state;

    return (
      <Wrapper>
        <ImageBoxAnimated
          image={
            "https://www.adventure-journal.com/wp-content/uploads/2015/06/o-the-glory-of-it-all.jpg"
          }
          width={600}
          height={400}
          noOfRows={8}
          speed={200}
          startAnimation={startFirstBoxAnimation}
          onClick={() =>
            this.setState({ startFirstBoxAnimation: !startFirstBoxAnimation })
          }
        />
        <ImageBoxAnimated
          image={
            "https://www.adventure-journal.com/wp-content/uploads/2015/06/o-the-glory-of-it-all.jpg"
          }
          width={`20vw`}
          height={`15vw`}
          noOfRows={4}
          speed={100}
          startAnimation={startSecondBoxAnimation}
          onClick={() =>
            this.setState({ startSecondBoxAnimation: !startSecondBoxAnimation })
          }
        />
      </Wrapper>
    );
  }
}

class ImageBoxAnimated extends Component {
    componentWillMount() {
        this.setState({
            animationNumber: 0,
        });
    }

    componentDidMount() {
        if (this.props.startAnimation) {
            this.runAnimation();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.startAnimation !== nextProps.startAnimation) {
            if (nextProps.startAnimation) {
                this.runAnimation();
            } else {
                this.reverseAnimation();
            }
        }
    }

    reverseAnimation = () => {
        for (var i = 0; i < this.props.noOfRows; i++) {
            setTimeout(this.reverseLastAnimation, i * this.props.speed);
        }
    }

    runAnimation = () => {
        for (var i = 0; i < this.props.noOfRows; i++) {
            setTimeout(this.startNextAnimation, i * this.props.speed);
        }
    }

    reverseLastAnimation = () => {
        this.setState({
            animationNumber: this.state.animationNumber - 1,
        });
    }

    startNextAnimation = () => {
        this.setState({
            animationNumber: this.state.animationNumber + 1,
        });
    }

    render() {
        const {
            image,
            width,
            height,
            noOfRows,
            ...props,
        } = this.props;

        const {
            animationNumber,
        } = this.state;

        return (
            <ImageBox
                image={image}
                width={width}
                height={height}
                {...props}
            >
                {Array(noOfRows).fill().map((_, i) => (
                    <BlackBoxAnimated
                        key={i}
                        heightPercentage={100 / noOfRows}
                        reverseDirection={i % 2 === 0}
                        startAnimation={animationNumber >= i + 1}
                    />
                ))}
            </ImageBox>
        );
    }
}

const BlackBoxAnimated = ({ startAnimation = false, heightPercentage, reverseDirection = false }) => (
    <Motion
        defaultStyle={{ scaleX: 1 }}
        style={{ scaleX: spring(startAnimation ? 0 : 1) }}
    >
        {(style) => (
            <BlackBox
                heightPercentage={heightPercentage}
                xDirection={reverseDirection ? `left` : `right`}
                style={{
                    transform: `scaleX(${style.scaleX})`,
                }}
            />
        )}
    </Motion>
);

BlackBoxAnimated.propTypes = {
    startAnimation: PropTypes.bool,
    heightPercentage: PropTypes.number.isRequired,
    reverseDirection: PropTypes.bool,
};

ImageBoxAnimated.propTypes = {
    image: PropTypes.string.isRequired,
    width: PropTypes.any.isRequired,
    height: PropTypes.any.isRequired,
    noOfRows: PropTypes.number.isRequired,
    speed: PropTypes.number.isRequired,
}


export default Button;
