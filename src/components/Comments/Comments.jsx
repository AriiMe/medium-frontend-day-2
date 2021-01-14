/** @format */

import React from "react";
import { Button, Image } from "react-bootstrap";
import { IoTrashOutline, IoBuildOutline } from "react-icons/io5";
import "./styles.css";

class Comments extends React.Component {
  state = {
    showComments: false,
    editing: false,
    reviews: [],
    id: "",
  };

  componentDidMount = () => {
    this.fetchReviews();
  };

  fetchReviews = async () => {
    try {
      let response = await fetch(
        "http://localhost:3666/medium/" + this.props.id + "/reviews"
      );
      let reviewsArray = await response.json();
      this.setState({ reviews: reviewsArray });
    } catch (error) {
      console.log(error);
    }
  };

  postReview = async (e) => {
    e.preventDefault();
    try {
      let text = document.querySelector("#commentForReview").value;
      let body = {
        text: text,
        user: "yeetman",
      };
      let response = await fetch(
        "http://localhost:3666/medium/" + this.props.id,
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      document.querySelector("#commentForReview").value = "";
      this.fetchReviews();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  calculateTimeDiff = (current, updated) => {
    let currentTime = new Date();
    let postDate = new Date(current);
    let currentMilli = currentTime.getTime();
    let postMilli = postDate.getTime();
    let diffMilli = currentMilli - postMilli;
    let diffMins = Math.ceil(diffMilli / 60000);
    if (diffMins >= 60) {
      let timeDiff = Math.floor(diffMins / 60).toString() + "h";

      if (current === updated) {
        return timeDiff;
      } else {
        return timeDiff + "• Edited";
      }
    } else {
      let timeDiff = diffMins.toString() + "m";

      if (current === updated) {
        return timeDiff;
      } else {
        return timeDiff + "• Edited";
      }
    }
  };

  deleteArticle = async (reviewID) => {
    try {
      let response = await fetch(
        "http://localhost:3666/medium/" +
          this.props.id +
          "/reviews/" +
          reviewID,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        this.fetchReviews();
      }
    } catch (error) {
      console.log(error);
    }
  };

  primeEdit = (content, id) => {
    this.setState({ editing: true, id: id });
    document.querySelector("#commentForReview").value = content;
  };

  cancelEdit = (e) => {
    e.preventDefault();
    this.setState({ editing: false, id: "" });
    document.querySelector("#commentForReview").value = "";
  };

  editReview = async (e) => {
    e.preventDefault();
    try {
      let text = document.querySelector("#commentForReview").value;
      let body = {
        text: text,
        user: "Not_Abdul",
      };
      let response = await fetch(
        "http://localhost:3666/medium/" +
          this.props.id +
          "/reviews/" +
          this.state.id,
        {
          method: "PUT",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      this.setState({ editing: false, id: "" });
      document.querySelector("#commentForReview").value = "";
      this.fetchReviews();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <>
        <span
          className="responses"
          style={{ fontSize: 12, marginLeft: "0.5em" }}
          onClick={() =>
            this.state.showComments
              ? this.setState({ showComments: false })
              : this.setState({ showComments: true })
          }
        >
          {this.state.reviews.length > 0
            ? this.state.reviews.length + " "
            : "No "}
          Responses
        </span>
        <div
          id="reviewsColumn"
          className={this.state.showComments ? "d-flex" : "d-none"}
        >
          <div
            className="commentBox d-flex flex-column"
            style={{ marginTop: 50, marginBottom: 50 }}
          >
            <label>What are your thoughts?</label>
            <textarea
              id="commentForReview"
              placeholder="What are your thoughts?"
            />
            {this.state.editing ? (
              <div className="d-flex">
                <Button
                  variant="warning"
                  className="mx-auto w-100"
                  onClick={(e) => this.editReview(e)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="mx-auto w-100"
                  onClick={(e) => this.cancelEdit(e)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="success" onClick={(e) => this.postReview(e)}>
                Send
              </Button>
            )}
          </div>
          <div className="commentsHolder d-flex flex-column">
            {this.state.reviews.length > 0 &&
              this.state.reviews.map((review) => (
                <div className="singleComment">
                  <div className="postInfo">
                    <div>
                      <Image
                        style={{ width: 50, height: 50, marginRight: 15 }}
                        src="https://pbs.twimg.com/profile_images/1162445050590183424/WL2lQ7OR.jpg"
                        roundedCircle
                      />
                    </div>
                    <div>
                      {review.user}
                      <p>
                        {this.calculateTimeDiff(
                          review.createdAt,
                          review.updatedAt
                        )}{" "}
                        ago
                      </p>
                    </div>
                    <IoBuildOutline
                      className="mx-2"
                      style={{ fontSize: 20, cursor: "pointer" }}
                      onClick={() => this.primeEdit(review.text, review._id)}
                    />
                    <IoTrashOutline
                      style={{ fontSize: 20, cursor: "pointer" }}
                      onClick={() => this.deleteArticle(review._id)}
                    />
                  </div>
                  <div className="postBody">{review.text}</div>
                </div>
              ))}
          </div>
        </div>
      </>
    );
  }
}
export default Comments;
