/** @format */

import React, { Component } from "react";
import ReactQuill from "react-quill";
import { Container } from "react-bootstrap";
import "react-quill/dist/quill.bubble.css";
import { Button } from "react-bootstrap";
import "./styles.scss";
import CategoryPicker from "../../components/CategoryPicker";

export default class NewStory extends Component {
  state = {
    html: "",
    category: {},
    title: "",
    img: "",
  };
  editor = React.createRef();
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
    this.postArticle();
  };
  postArticle = async () => {
    try {
      let body = {
        category: this.state.category,
        author: {
          name: "Ari",
          img: "https://img.memecdn.com/buying-gf_o_7109591.jpg",
        },
        headLine: this.state.title,
        subHead: "yooooo",
        content: this.state.html,
        cover: this.state.img,
      };
      console.log(body);
      let response = await fetch("http://localhost:3666/medium/", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      this.props.history.push("/");
      console.log(response);
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
