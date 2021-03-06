import React from 'react';
import {Link, router, Router, hashHistory, withRouter} from 'react-router';
import {connect} from 'react-redux';
import {fetchProfile} from '../actions/user_actions';
import {fetchFriends, deFriend, confirmRequest, sendRequest} from '../actions/friends_actions';
import NavBar from './navbar_container';
import PostList from './postlist_container';
import FriendsView from './friends_view';
import AboutView from './about_view';


const findFriendship = (state) => {
  if (!state.friendships) {return;}
  let value = null;
  Object.keys(state.friendships).forEach(id => {
    if (state.session.currentUser.id === state.friendships[id].receiver_id ||
        state.session.currentUser.id === state.friendships[id].friender_id) {
      value = state.friendships[id];
    }
  });
  return value;
};

const buttonDecider = (friendship, state, ownProps) => {
  if (!ownProps) {return;}
  if (ownProps.params.id == state.session.currentUser.id) {
    return 'Update Info';
  } else if (friendship) {
    if (friendship.completed) {
      return 'Remove Friend';
    } else {
      return friendship.friender_id === state.session.currentUser.id ?
        'Cancel Request' : 'Accept Request';
    }
  } else {
    return 'Add Friend';
  }
};

  const mapStateToProps = (state, ownProps) => ({
    currentUser: state.session.currentUser,
    user: state.user,
    posts: Object.keys(state.posts).map(id => state.posts[id]),
    friendships: state.friendships,
    friends: state.friends,
    buttonText: buttonDecider(findFriendship(state), state, ownProps),
    currentFriendship: findFriendship(state)
  });

  const mapDispatchToProps = dispatch => ({
    fetchProfile: id => dispatch(fetchProfile(id)),
    deFriend: id => dispatch(deFriend(id)),
    confirmRequest: id => dispatch(confirmRequest(id)),
    sendRequest: id => dispatch(sendRequest(id))
  });

class ProfileContainer extends React.Component {

  constructor(props) {
    super(props);
    this.handleButton = this.handleButton.bind(this);
    this.state = {posts: this.props.posts};
  }

  componentDidMount() {
    this.props.fetchProfile(this.props.params.id).then(action => {
    window.scrollTo(0, 100);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.id !== this.props.params.id) {
      window.scrollTo(0, 100);
      this.props.fetchProfile(this.props.params.id);
    }
  }

  handleButton(event) {
      switch(this.props.buttonText) {
        case 'Update Info':
          this.props.router.push(`/users/${this.props.currentUser.id}/edit`);
          break;
        case 'Add Friend':
          this.props.sendRequest(this.props.user.id).then(this.setState({buttonText: 'Cancel Request'}));
          break;
        case 'Accept Request':
          this.props.confirmRequest(this.props.currentFriendship.id).then(this.setState({buttonText: 'Remove Friend'}));
          break;
        case 'Cancel Request':
        case 'Remove Friend':
          this.props.deFriend(this.props.currentFriendship.id).then(this.setState({buttonText: 'Add Friend'}));
          break;
      }
  }

  render() {
    const {
      fname,
      lname,
      birthday,
      work,
      school,
      relationship,
      fromPlace,
      LivesAt
    } = this.props.user;

    const friends = this.props.friends;
    const friendTiles = (friends) => {
      if (!friends) {return;}
      const arr = [];
      let keys = Object.keys(friends);
      let max = 9;
      if (9 > keys.length) {
        max = keys.length;
      }
      for (var i = 0; i < max; i++) {
        arr.push(
          <Link className='friend-tile' key={i} to= {`/users/${[keys[i]]}/`}>

            <label className='friend-tile-name'>
              {`${friends[keys[i]].fname} ${friends[keys[i]].lname}`}
            </label>

            <img className='friend-tile-img'
            src={friends[keys[i]].profile_pic_url} />

          </Link>
        );
      }
      return <div className='friend-tiles'>{arr}</div>;
    };
    const pathname = this.props.router.location.pathname.split('/')[3] || 'timeline';

    const content = () => {
      switch(pathname) {
      case 'friends':
        return <FriendsView classname='timeline' friends={friends} />;
      case 'about':
        return <AboutView classname='timeline' user={this.props.user} />;
      case 'timeline':
      default:
        return <PostList className='timeline' profile={true} />;
      }
    };

    if (!this.props.user.fname) {
      return null;
    } else {

      return (
        <div>
          <NavBar />
          <div className='top-wrapper'>
            <img className='cover-photo' src={this.props.user.cover_photo_url} />
            <div className='pp-floater'>
              <div className='pp-border'><img className='profile-pic' src={this.props.user.profile_pic_url}/></div>
              <label className='name'>{fname} {lname}</label>
              <div className='profile-btn' onClick={this.handleButton}>{this.props.buttonText}</div>
            </div>
            <ul className='profile-tabs'>
              <div className={`nib ${pathname}`}></div>
                <Link to={`/users/${this.props.user.id}`}><li>Timeline</li></Link>
                <Link to={`/users/${this.props.user.id}/about`}><li>About</li></Link>
                <Link to={`/users/${this.props.user.id}/friends`}><li>Friends</li></Link>
            </ul>
          </div>
          <div className='profile-content-wrapper'>
            <div className='sidecards-wrapper'>
              <div className='intro-wrapper card'>
                <div className='sidecard-title'>
                  <i className='fa fa-globe'></i>
                  <h2>Intro</h2>
                </div>
                <ul>
                  <li><i className='fa fa-mortar-board'></i><p>Studied at</p><p>{school}</p></li>
                  <li><i className='fa fa-briefcase'></i><p>Works at</p><p>{work}</p></li>
                  <li><i className='fa fa-home'></i><p>Lives in</p><p>{livesAt}</p></li>
                  <li><i className='fa fa-heart'></i><p>Relationship</p><p>{relationship}</p></li>
                  <li><i className='fa fa-map-marker'></i><p>From</p><p>{fromPlace}</p></li>
                  <li><i className='fa fa-birthday-cake'></i><p>Born on</p><p>{birthday}</p></li>
                </ul>
              </div>
              <div className='friends-side-wrapper card'>
                <div className='sidecard-title'>
                  <i className='fa fa-users'></i>
                  <h2>Friends</h2><h2>{`· ${Object.keys(friends).length}`}</h2>
                </div>
              {friendTiles(friends)}
              </div>
            </div>
            {content()}
          </div>
        </div>
      );
    }
  }
}

export default withRouter (connect(mapStateToProps, mapDispatchToProps)(ProfileContainer));
