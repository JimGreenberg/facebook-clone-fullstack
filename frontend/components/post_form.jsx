import React from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router';
import {placeTooltip} from './tooltip';
import {createPost, updatePost} from '../actions/post_actions';


  const mapStateToProps = (state, ownProps) => {
  let post = ownProps.post || {body: "", author_id: state.session.currentUser.id, wall_user_id: ownProps.wallUserId};
  return { post };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const action = ownProps.formType === "new" ? createPost : updatePost;
  return {
    fetchPost: id => dispatch(fetchPost(id)),
    action: post => dispatch(action(post))
  };
};

class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.post;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    if (!this.props.post) {return null;}
    this.state = this.props.post;
    this.setState({action: this.props.updatePost});
  }

  update() {
      return event => {
        this.setState({body: event.currentTarget.value});
      };
    }

    success() {
      return this.props.formType === 'new' ? () => this.setState({body: ""}) : () => this.props.handleEdit();
    }

  handleSubmit(event) {
    event.preventDefault();
    this.props.action(this.state).then(this.success());
  }

  render () {
    let buttonText = this.props.formType === 'new' ? 'Post' : 'Update';
    return (
      <form className='postform card' onSubmit={this.handleSubmit}>
        <div className='overbar'><label>Status</label></div>
        <div className='form-main'>
          <div className='nib'></div>
          <img></img>
          <textarea onChange={this.update()} value={this.state.body} placeholder="What's on your mind?">
          </textarea>
        </div>
        <div className="underbar">
          <input type='submit' className='submit' value={buttonText}/>
        </div>
      </form>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostForm));