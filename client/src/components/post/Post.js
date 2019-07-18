import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layouts/Spinner'
import { getPost } from '../../actions/posts'
import PostItem from '../posts/PostItem'
import CommentForm from '../post/CommentForm'
import CommentItem from '../post/CommentItem'
import { Link } from 'react-router-dom'

const Post = ({ getPost, post: { singlePost, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id)
  }, [getPost, match.params.id])

  return loading || singlePost === null ? <Spinner /> : 
    <Fragment>
      <Link to="/posts" className="btn">Back To Posts</Link>
      <PostItem post={singlePost} showActions={false} />
      <CommentForm postId={singlePost._id} />
      <div className="comments">
        {singlePost.comments.map(comment => (
          <CommentItem key={comment._id} comment={comment} postId={singlePost._id} />
        ))}
      </div>
    </Fragment>
}

Post.propTypes = {
 getPost: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  post: state.post
})

export default connect(mapStateToProps, { getPost })(Post)
