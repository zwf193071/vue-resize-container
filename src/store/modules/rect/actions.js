import types, {CHANGE_ZINDEX} from './mutation-types';

export default {
    setWidth({commit}, {id, width}) {
        commit(types.CHANGE_WIDTH, {id, width});
    },

    setHeight({commit}, {id, height}) {
        commit(types.CHANGE_HEIGHT, {id, height});
    }
};
