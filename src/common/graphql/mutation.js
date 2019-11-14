import gql from 'graphql-tag'
import fragments from './fragments'


const mutation = {
  reviewCreate: gql`
    mutation reviewCreate($postId:ObjectId!,$content:String!,$score:Int!) {
      reviewCreate(postId:$postId,content:$content,score:$score) {
        id
        postId
        status
        content
        score
        likes
        createdAt
        author{
          ...userFields
        }
        viewerCanDelete
      }
    }
    ${fragments.userFields}
  `,
  reviewDelete: gql`
    mutation reviewDelete($reviewId:ObjectId!) {
      reviewDelete(reviewId:$reviewId) 
    }
  `,

  postLike: gql`
    mutation postLike($postId:ObjectId!) {
                postLike(postId:$postId) {
                   id
                   likes
                }
              }
  `,

  postUnlike: gql`
    mutation postUnlike($postId:ObjectId!) {
                postUnlike(postId:$postId) {
                   id
                   likes
                }
              }
  `,
  commentCreate: gql`
    mutation commentCreate($targetId:ObjectId!,$targetType:String!,$content:String!) {
                commentCreate(targetId:$targetId,targetType:$targetType,content:$content) {
                    id
                    content
                    createdAt
                    viewerCanDelete
                    author{
                      id
                      name
                      avatar
                    }
                }
              }
  `,

  commentDelete: gql`
    mutation commentDelete($commentId:ObjectId!) {
                commentDelete(commentId:$commentId)
              }
  `,

  postModerate: gql`
    mutation postModerate($postId:ObjectId!,$action:String!) {
       postModerate(postId:$postId,action:$action){
          categories
          pendingCategories
       }
    }
   
  `,
};

export default mutation;
