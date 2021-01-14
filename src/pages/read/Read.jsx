/** @format */

import React, { Component } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import "./index.scss";
// import article from "./data.json";
import { IoLogoTwitter, IoLogoLinkedin, IoLogoFacebook } from "react-icons/io";
import { IoBookmarkOutline } from "react-icons/io5";
import Reactions from "../../components/Reactions/Reactions";
class Read extends Component {
  state = {
    article: {},
  };
  componentDidMount = () => {
    this.fetchArticle();
  };

  fetchArticle = async () => {
    try {
      let response = await fetch(
        "http://localhost:3666/medium/" + this.props.match.params.slug
      );
      let article = await response.json();
      console.log(article);
      this.setState({ article: article });
    } catch (error) {
      console.log(error);
    }
  };

  htmlArticle = () => {
    return { __html: this.state.article.content };
  };

  render() {
    return (
      this.state.article.hasOwnProperty("category") && (
        <Container className="article-container">
          <h1>{this.state.article.headLine}</h1>
          <Row style={{ marginTop: 20, marginBottom: 20 }}>
            <Col xs={1}>
              <Image
                style={{ width: 50, height: 50 }}
                src={this.state.article.author.img}
                roundedCircle
              />
            </Col>
            <Col>
              {this.state.article.author.name}
              <p>Sep 23, 2018 · 3 min read</p>
            </Col>
            <Col>
              <div
                style={{
                  fontSize: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <IoLogoTwitter />
                <IoLogoLinkedin />
                <IoLogoFacebook />
                <IoBookmarkOutline />
              </div>
            </Col>
          </Row>
          <div dangerouslySetInnerHTML={this.htmlArticle()} />
          <Reactions id={this.state.article._id} />
        </Container>
      )
    );
  }
}

export default withRouter(Read);
