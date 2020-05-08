import React from 'react';
import { Redirect } from 'react-router-dom';
import NewPostForm from './newPostForm';

export default class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      loggedIn: props.loggedIn,
      token: JSON.parse(localStorage.getItem("userToken")),
      posts: []
    };
    console.log("Posts logged in state: " + this.state.loggedIn);
  }

  componentDidMount() {
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
        throw new Error("Something went wrong.");
      }
    })
    .then(data => this.setState({ posts: JSON.parse(data) }))
    .catch(error => console.log(error));
  }

  componentWillUnmount() {
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
            <p><b>Username:</b> {post.postedBy.username} <b>Posted on:</b> {new Date(post.datePosted).toString()}</p>
            <p><i>{post.message}</i></p>
          </div>
        ))}
      </div>
    );
  }
}