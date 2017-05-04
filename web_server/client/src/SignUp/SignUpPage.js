import React, {PropTypes} from 'react';

import SignUpForm from './SignUpForm';

class SignUpPage extends React.Component {

    constructor(props, context) {
        super(props, context);

        // set the initial component state
        this.state = {
            errors: {},
            user: {
                email: '',
                password: '',
                confirm_password: ''
            }
        };

        this.processForm = this.processForm.bind(this);
        this.changeUser = this.changeUser.bind(this);
    }

    processForm(event) {
        // prevent default action. in this case, action is the form submission event
        event.preventDefault();

        const email = this.state.user.email;
        const password = this.state.user.password;
        const confirm_password = this.state.user.confirm_password;

        console.log('email:', email);
        console.log('password:', password);
        console.log('confirm_assword:', confirm_password);

        if (password !== confirm_password) {
            return;
        }

        // Post registeration data
        fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            cache: false,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.user.email,
                password: this.state.user.password
            })
        }).then(response => {
            if (response.status === 200) {
                this.setState({
                    errors: {}
                });

                // change the current URL to /login
                this.context.router.replace('/login');

            } else {
                response.json().then(function(json) {
                    console.log(json);
                    const errors = json.errors ? json.errors : {};
                    errors.summary = json.message;
                    console.log(this.state.errors);
                    this.setState({errors});
                }.bind(this));
            }
        });
    }

    changeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;

        this.setState({
            user
        });

        if (this.state.user.password !== this.state.user.confirm_password) {
            const errors = this.state.errors;
            errors.password = "Password and Confirm Password don't match.";
            this.setState({errors});
        } else {
            const errors = this.state.errors;
            errors.password = '';
            this.setState({errors});
        }
    }

    render() {
        return (
            <SignUpForm
                onSubmit={this.processForm}
                onChange={this.changeUser}
                errors={this.state.errors}
                user={this.state.user}
            />
        );
    }

}

// To make react-router work
SignUpPage.contextTypes = {
    router: PropTypes.object.isRequired
};

export default SignUpPage;