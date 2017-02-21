import React from 'react';
import {router, Router, hashHistory} from 'react-router';
import {connect} from 'react-redux';
import {signOut} from '../actions/session_actions';
import {fetchProfile} from '../actions/user_actions';
import NavBar from './navbar_container';
import PostList from './postlist_container';



  const mapStateToProps = state => ({
    user: state.session.currentUser,
    posts: Object.keys(state.posts).map(id => state.posts[id])
  });

  const mapDispatchToProps = dispatch => ({
    signOut: () => dispatch(signOut()),
    fetchProfile: id => dispatch(fetchProfile(id))
  });

class ProfileContainer extends React.Component {

  constructor(props) {
    super(props);
    this.btnState = this.props.params.id == this.props.user.id ?
      'Update Profile' : 'Add Friend';
    this.state = {posts: this.props.posts};
  }

  componentDidMount() {
    this.props.fetchProfile(this.props.params.id);
    window.scrollTo(0, 100);
  }

  render() {
    const {fname, lname, birthday, work, school, relationship, from, where} = this.props.user;
    return (
      <div>
        <NavBar />
        <div className='top-wrapper'>
          <img className='cover-photo'></img>
          <div className='pp-floater'>
            <img className='profile-pic'></img>
            <label className='name'>{fname} {lname}</label>
            <div className='profile-btn'>{this.btnState}</div>
          </div>
          <ul className='profile-tabs'>
            <li>Timeline</li>
            <li>About</li>
            <li>Friends</li>
          </ul>
        </div>
        <div className='profile-content-wrapper'>
          <div className='sidecards-wrapper'>
            <div className='intro-wrapper card'>
              <h2>Intro</h2>
              <ul>
                <li><div className='icon-nano'></div>Studied at {school}</li>
                <li><div className='icon-nano'></div>Works at {work}</li>
                <li><div className='icon-nano'></div>Born on {birthday}</li>
                <li><div className='icon-nano'></div>Relationship status: {relationship}</li>
                <li><div className='icon-nano'></div>From {from}</li>
                <li><div className='icon-nano'></div>Lives in {where}</li>
              </ul>
            </div>
            <div className='friends-side-wrapper card'>
              <h2>Friends</h2>

            </div>
          </div>
          <PostList className='timeline' profile={true} posts={this.props.posts} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
