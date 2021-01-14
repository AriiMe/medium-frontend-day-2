/** @format */

import React from "react";
import { withRouter } from "react-router-dom";
import { IoTrashOutline, IoBuildOutline } from "react-icons/io5";

class EditArticles extends React.Component {
  deleteArticle = async () => {
    try {
      let response = await fetch(
        "http://localhost:9001/articles/" + this.props.article._id,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        this.props.fetchArticles();
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div
        className={`w-100 d-flex mb-auto align-start  pb-3 pt-3 ${
          this.props.articleImg === "top" && "flex-column-reverse"
        }`}
      >
        {this.props.articleImg && (
          <img
            alt="cover"
            className={
              this.props.articleImg === "top" ? "img-large" : "img-small"
            }
            src={this.props.article.cover}
          />
        )}
        <div className="ml-3">
          <div className={"d-flex align-center mb-2"}>
            <img
              alt="cover"
              style={{ width: "20px", height: "20px" }}
              src={
                "https://miro.medium.com/fit/c/20/20/1*xF11-TSkpJSCgLc75f-DFw.jpeg"
              }
            />

            <span className={"author mr-3"}>
              Posted in{" "}
              <b>
                {this.props.article.category &&
                  this.props.article.category.name}
              </b>
            </span>
            <IoBuildOutline
              className="mr-3"
              style={{ fontSize: 20, cursor: "pointer" }}
              onClick={() =>
                this.props.history.push("/edit-story/" + this.props.article._id)
              }
            />
            <IoTrashOutline
              style={{ fontSize: 20, cursor: "pointer" }}
              onClick={() => this.deleteArticle()}
            />
          </div>

          <span
            className={"heading"}
            style={{
              fontSize: this.props.headingFont === "small" ? "16px" : "22px",
              lineHeight: this.props.headingFont === "small" ? "20px" : "28px",
            }}
            onClick={() =>
              this.props.history.push("/read/" + this.props.article._id)
            }
          >
            {this.props.article.headLine}
          </span>

          {this.props.subheading && (
            <div className={"subheading"}>
              <p>
                <span>{this.props.article.subHead}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(EditArticles);
