import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {signIn, signUp, signOut} from '../actions/session_actions';
import {placeTooltip} from './tooltip';


const mapStateToProps = (state, ownProps) => ({
  signedIn: Boolean(state.session.currentUser),
  errors: state.session.errors
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  signIn: user => dispatch(signIn(user))
});

class SessionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      sessionFlag: false,
      forgotFlag: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.disabled = false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.errors.session !== this.props.errors.session) {
      this.setState({sessionFlag: !!this.props.errors.session});
    }
  }

  logInAs(username, password) {
    this.disabled = true;
    this.typeValue(username, "username", function () {
      this.typeValue(password, "password", function () {
        this.props.signIn(this.state);
      }.bind(this));
    }.bind(this));
  }

  typeValue(value, name, cb) {
    if (!value) return cb();
    this.setState({ [name]: this.state[name] + value[0] });
    setTimeout(function () {
      this.typeValue(value.slice(1), name, cb);
    }.bind(this), 75);
  }

  update(field) {
  		return event => this.setState({
  			[field]: event.currentTarget.value
  		});
  	}

  handleSubmit(event) {
    event.preventDefault();
    const user = this.state;
    let enteredPass = this.state.password; //reset password field on login attempt
    user.password=enteredPass;
    this.setState({password: ""});
    this.props.signIn(user).then(() => this.props.router.push('/'));
  }

  render() {
    return(
        <form onSubmit={this.handleSubmit}>

          <fieldset disabled={this.disabled}>
          <div className="form-wrapper">

            <div className="field-grp">
            <label>Email or Phone</label>
            <input
              type="username"

              value={this.state.username}
              className="field"
              onChange={this.update("username")}/>
            {placeTooltip(this.props.errors.session, "error", this.state.sessionFlag)}
            </div>

            <div className="field-grp">
            <label>Password</label>
            <input
              type="password"

              value={this.state.password}
              className="field"
              onChange={this.update("password")}/>

            <div className='attache-wrapper'>
              <a className={this.state.demoBtn}
                 onClick={() => this.setState({ forgotFlag: !this.state.forgotFlag })}
              >Forgot Account?</a>
            {placeTooltip("Why not use the demo log in?", "mainsplash-tt",this.state.forgotFlag, "Okay", () => this.setState({forgotFlag: !this.state.forgotFlag}))}
            </div>
          </div>

          <input
            className='button'
            type="submit"
            value="Log In"
            />

          <input
            className={`${this.state.demoBtn} button`}
            type="submit"
            value="Demo Log In"
            onClick={(e) => {
                      e.preventDefault();
                      this.setState({username: "", password: "", demoBtn: 'disabled'},
                      this.logInAs("jjerry@seinfeld.com", 'asdfasdf'));
                    }}
            />

        </div>
        </fieldset>
        </form>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionForm);
