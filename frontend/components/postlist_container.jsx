import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {signOut} from '../actions/session_actions';
import Tooltip from './tooltip';
import {fetchNewsfeed, updatePost, deletePost} from '../actions/post_actions';
import PostIndexItem from './post_index_item';
import PostForm from './post_form';

const mapStateToProps = state => ({
  currentUserId: state.session.currentUser.id,
  posts: Object.keys(state.posts).map(id => state.posts[id])

});

const mapDispatchToProps = dispatch => ({
  fetchNewsfeed: () => dispatch(fetchNewsfeed()),
  deletePost: id => dispatch(deletePost(id))
});

class PostList extends React.Component {

  componentDidMount() {
    this.props.fetchNewsfeed();
  }

  render() {
    return (
      <ul className='postlist-wrapper'>
        {this.props.posts.map( post => {

          return <PostIndexItem
            key={this.props.posts.indexOf(post)}
            post={post}
            deletePost={this.props.deletePost}/>;
        })}

        <PostForm formType='new' wallUserId={this.props.currentUserId} />
      </ul>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostList);
