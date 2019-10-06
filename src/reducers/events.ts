import lodash from 'lodash';
import { READ_EVENTS, DELETE_EVENT, READ_EVENT, CREATE_EVENT, UPDATE_EVENT} from '../actions';

export default (events: any = {}, action: any) => {
    switch (action.type) {
        case READ_EVENTS:
            return lodash.mapKeys(action.response.data, 'id');
        case READ_EVENT:
        case CREATE_EVENT:
        case UPDATE_EVENT:
            const data = action.response.data;
            return { ...events, [data.id]: data };
        case DELETE_EVENT:
            delete events[action.id];
            return { ...events };
        default:
            return events;
    }
}