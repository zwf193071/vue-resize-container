import {
    CHANGE_HEIGHT,
    CHANGE_WIDTH
} from './mutation-types';

export default {
    [CHANGE_HEIGHT](state, payload) {
        state.rects[payload.id].height = payload.height;
    },

    [CHANGE_WIDTH](state, payload) {
        state.rects[payload.id].width = payload.width;
    }
};