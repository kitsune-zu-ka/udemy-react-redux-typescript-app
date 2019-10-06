import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, InjectedFormProps} from 'redux-form';
import { Link } from 'react-router-dom';
import * as H from "history";

import { getEvent, deleteEvent, putEvent } from '../actions';

interface Props {
    getEvent: Function;
    deleteEvent: Function;
    putEvent: Function;
    history: H.History;
    match: any;
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

class EventsShow extends Component<Props & InjectedFormProps<{}, Props>> {
    constructor(props: any) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        if (id) this.props.getEvent(id);
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

    async onDeleteClick() {
        const { id } = this.props.match.params;
        await this.props.deleteEvent(id);
        this.props.history.push('/');
    }

    async onSubmit(values: any) {
        await this.props.putEvent(values);
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
                    <Link to="/" onClick={ this.onDeleteClick }>Delete</Link>
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

const mapStateProps = (state: any, ownProps: Props) => {
    const event = state.events[ownProps.match.params.id];
    return { initialValues: event, state };
};
const mapDispatchToProps = ({ deleteEvent, getEvent, putEvent });

export default connect(mapStateProps, mapDispatchToProps)(
    reduxForm<{}, Props>({ validate, form: 'eventShowForm', enableReinitialize: true })(EventsShow)
);