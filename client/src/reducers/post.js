import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from '../actions/types'

const initialState = {
  posts: [],
  singlePost: null,
  loading: true,
  error: {}
}

export default function(state = initialState, action) {
  const { payload, type } = action;

  switch(type) {
    case GET_POSTS:
      return {
      ...state,
      posts: payload,
      loading: false
    }
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        lodaing: false
      }
    case GET_POST:
      return {
        ...state,
        singlePost: payload,
        loading: false
      }
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== payload.postId),
        lodaing: false 
      }
    case POST_ERROR:
      return {
      ...state,
      error: payload,
      loading: false
    }
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post => post._id === payload.postId ? 
          { ...post, likes: payload.likes } : post
        ),
        loading: false
      }
    case ADD_COMMENT:
      return {
        ...state,
        singlePost: { ...state.singlePost, comments: payload},
        loading: false
      }
    case REMOVE_COMMENT:
      return {
        ...state,
        singlePost: {
          ...state.singlePost,
          comments: state.singlePost.comments.filter(comment => comment._id !== payload)
        },
        loading: false
      }
    default: return state;
  }
}