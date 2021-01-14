/** @format */

import React, { Component } from "react";
import ReactQuill from "react-quill";
import { Container } from "react-bootstrap";
import "react-quill/dist/quill.bubble.css";
import { Button, Alert } from "react-bootstrap";
import "./styles.scss";
import CategoryPicker from "../../components/CategoryPicker";

export default class NewStory extends Component {
  state = {
    html: "",
    category: {},
    title: "",
    img: "",
    subtitle: "",
    authorName: "",
  };
  editor = React.createRef();
  componentDidMount = () => {
    if (this.props.match.params.slug) {
      this.fetchAndAssign();
    }
  };
  onChange = (html) => {
    this.setState({ html });
    console.log(html);
  };
  onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.editor && this.editor.current.focus();
    }
  };
  submitButton = (e) => {
    e.preventDefault();
    if (this.state.authorName) {
      this.verifyUser();
    } else {
      alert("You need to include a username");
    }
  };
  verifyUser = async () => {
    try {
      let response = await fetch(
        "http://localhost:3666/authors/?name=" + this.state.authorName
      );

      if (response.ok) {
        let author = await response.json();
        this.postArticle(author._id);
      } else {
        console.log("not found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  addArticleToUser = async (articleID, authorID) => {
    try {
      let response = await fetch(
        "http://localhost:3666/medium/" +
          articleID +
          "/add-to-author/" +
          authorID,
        {
          method: "POST",
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  postArticle = async (authorID) => {
    try {
      let body = {
        category: this.state.category,
        author: authorID,
        headLine: this.state.title,
        subHead: this.state.subtitle,
        content: this.state.html,
        cover: this.state.img,
      };
      console.log(body);
      if (this.props.match.params.slug) {
        await fetch(
          "http://localhost:3666/medium/" + this.props.match.params.slug,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        let response = await fetch("http://localhost:3666/medium/", {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        });
        let res = await response.json();
        console.log("RESPONSE", res);
        this.addArticleToUser(res, authorID);
      }
      this.props.history.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  fetchAndAssign = async () => {
    try {
      let response = await fetch(
        "http://localhost:3666/medium/" + this.props.match.params.slug
      );
      let article = await response.json();
      console.log(article);
      this.setState({
        html: article.content,
        category: article.category,
        title: article.headLine,
        img: article.cover,
        subtitle: article.subHead,
      });
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    const { html } = this.state;
    return (
      <Container className="new-story-container" expand="md">
        <div className="category-container">
          <CategoryPicker
            onChange={(topic) => {
              this.setState({ category: { name: topic.name, img: topic.img } });
            }}
          />
        </div>

        <input
          onKeyDown={this.onKeyDown}
          placeholder="Title"
          value={this.state.title}
          className="article-title-input"
          onChange={(e) => this.setState({ title: e.currentTarget.value })}
        />
        <input
          onKeyDown={this.onKeyDown}
          placeholder="Sub Title"
          value={this.state.subtitle}
          className="article-subtitle-input"
          onChange={(e) => this.setState({ subtitle: e.currentTarget.value })}
        />

        <ReactQuill
          modules={NewStory.modules}
          formats={NewStory.formats}
          ref={this.editor}
          theme="bubble"
          value={html}
          onChange={this.onChange}
          placeholder="Tell your story..."
        />
        <input
          onKeyDown={this.onKeyDown}
          placeholder="Username"
          className="article-cover-input"
          value={this.state.authorName}
          onChange={(e) => this.setState({ authorName: e.currentTarget.value })}
        />
        <input
          onKeyDown={this.onKeyDown}
          placeholder="Cover link e.g : https://picsum.photos/800"
          className="article-cover-input"
          value={this.state.img}
          onChange={(e) => this.setState({ img: e.currentTarget.value })}
        />

        <Button
          variant="success"
          className="post-btn"
          onClick={(e) => this.submitButton(e)}
        >
          Post
        </Button>
      </Container>
    );
  }
}

NewStory.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],

    ["bold", "italic", "blockquote"],
    [
      { align: "" },
      { align: "center" },
      { align: "right" },
      { align: "justify" },
    ],

    ["link", "image"],

    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
NewStory.formats = [
  "header",
  "bold",
  "italic",
  "blockquote",
  "align",

  "link",
  "image",
];
