import React from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import NewPostForm from './newPostForm';

export default class Posts extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      loggedIn: props.loggedIn,
      token: JSON.parse(localStorage.getItem("userToken")),
      username: JSON.parse(localStorage.getItem("username")),
      posts: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchPosts();
    this.interval = setInterval(() => {
      this.fetchPosts();
    }, 3000);
  }

  fetchPosts() {
    const token = this.state.token;
    // console.log(token);
    const searchParams = new URLSearchParams({"secret_token": token});
    fetch(`http://localhost:9000/posts?${searchParams.toString()}`, {
      method: "GET"
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      else {
        if (response.status === 401) {
          if (this._isMounted) {
            this.setState({ redirect: true });
          }
        }
        throw new Error("Something went wrong.");
      }
    })
    .then(data => {
      if (this._isMounted) {
        this.setState({ posts: JSON.parse(data) });
      }
    })
    .catch(error => console.log(error));
  }

  deletePost(postId) {
    const token = this.state.token;
    // console.log(token);
    const searchParams = new URLSearchParams({"secret_token": token});
    console.log(postId);
    fetch(`http://localhost:9000/posts/${postId}?${searchParams.toString()}`, {
      method: "DELETE"
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
      this.fetchPosts();
    })
    .catch(error => console.log(error));
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.interval);
  }

  render() {
    const posts = this.state.posts
      // Possible performance problem with creating new Date objects
      .sort(function(a,b){
        return new Date(b.datePosted) - new Date(a.datePosted)
      });
    if (!this.state.loggedIn) {
      this.setState({redirect: true});
    }
    if (this.state.redirect) {
      return <Redirect to="/login" />
    } 
    return (
      <div className="posts">
        <NewPostForm />

        {posts.map(post => (
          <div className="post" key={post._id}>
            <p>
              <b>Username:</b> {post.postedBy.username} 
              <b> Posted on:</b> {moment(new Date(post.datePosted)).format('MMMM Do YYYY, h:mm:ss a')}
            </p>
            <p><i>{post.message}</i></p>
            {/*Render button to delete post if it's posted by the logged in user*/}
            {(() => {
              if(post.postedBy.username === this.state.username) {
                return(
                  <button onClick={e => this.deletePost(post._id)}>Delete</button>
                )
              }
            })()}
          </div>
        ))}
      </div>
    );
  }
}