import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, InjectedFormProps} from 'redux-form';
import { Link } from 'react-router-dom';
import * as H from "history";


import { postEvent } from '../actions';

interface Props {
    history: H.History;
    postEvent: Function;
}

interface FieldProps {
    input: any;
    label: string;
    type: string;
    meta: {
        touched: string;
        error: string;
    };
}

interface Values {
    [key: string]: string;
}

interface Errors {
    [key: string]: string;
}

class EventsNew extends Component<Props & InjectedFormProps<{}, Props>> {
    constructor(props: any) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    renderField(field: FieldProps) {
        const { input, label, type, meta: { touched, error } } = field;
        return (
            <div>
                <input {...input} placeholder={label} type={type} />
                { touched && error && <span>{error}</span> }
            </div>
        );
    }

    async onSubmit(values: any) {
        await this.props.postEvent(values);
        this.props.history.push('/');
    }

    render() {
        const { handleSubmit, pristine, submitting, invalid } = this.props;

        return (
            <form onSubmit={ handleSubmit(this.onSubmit) }>
                <div>
                    <Field label="Title" name="title" type="text" component={ this.renderField }/>
                </div>
                <div>
                    <Field label="Body" name="body" type="text" component={ this.renderField }/>
                </div>
                <div>
                    <input type="submit" value="Submit" disabled={ pristine || submitting || invalid }/>
                    <Link to="/">Cancel</Link>
                </div>
            </form>
        );
    }
};

const validate = (values: Values) => {
    const errors: Errors = {};

    if (!values.title) errors.title = "Enter a title, please.";
    if (!values.body) errors.body = "Enter a body, please.";
    return errors;
};

const mapDispatchToProps = ({ postEvent });

export default connect(null, mapDispatchToProps)(
    reduxForm<{}, Props>({ validate, form: 'eventNewForm' })(EventsNew)
);