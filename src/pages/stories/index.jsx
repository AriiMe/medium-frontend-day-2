/** @format */

import React, { Component } from "react";
import { Container } from "react-bootstrap";
import EditArticles from "../../components/EditArticles/EditArticles";

export default class Stories extends Component {
  state = {
    articles: [],
  };

  componentDidMount = () => {
    this.fetchArticles();
  };

  fetchArticles = async () => {
    try {
      let response = await fetch("http://localhost:9001/articles/");
      let articles = await response.json();
      console.log(articles);
      this.setState({ articles: articles });
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    return (
      <Container>
        {this.state.articles.length > 0 &&
          this.state.articles.map((article) => (
            <EditArticles
              articleImg={"left"}
              headingFont={"large"}
              subheading
              article={article}
              fetchArticles={this.fetchArticles}
            />
          ))}
      </Container>
    );
  }
}
