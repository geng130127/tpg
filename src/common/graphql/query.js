import gql from 'graphql-tag'
import fragments from './fragments'

const query = {};
query.initialize = gql`
  query viewer{
    viewer{
      id
      slug
      name
      avatar
      mobile
      role
      memberLevel
      reviewCategories
    }
    site(id:12306){
      id
      categoryList {
        id
        name
        slug
      }
    }
  }`;

query.categoryPostList = gql`
  query category($categorySlug:String,$offset:Int,$size:Int){
    category(slug:$categorySlug){
      postList(offset:$offset,size:$size){
        ...postFields
        photoList{
          ...photoFields
          aspectRatio
        }
        author{
          ...userFields
        }
      }
    }
  }
  ${fragments.postFields}
  ${fragments.userFields}
  ${fragments.photoFields}
`;

query.postsPopular = gql`
  query category($categorySlug:String,$offset:Int,$size:Int){
    category(slug:$categorySlug){
      postList(offset:$offset,size:$size){
        ...postFields
        photoList{
          ...photoFields
          aspectRatio
        }
        author{
          ...userFields
        }
      }
    }
  }
  ${fragments.postFields}
  ${fragments.photoFields}
  ${fragments.userFields}
`;

query.postBySlug = gql`
  query post($slug:String!){
    post(slug:$slug){
      ...postFields
      pendingCategories
      viewerLiked
      viewerCanReview

      photoList{
        id
        url(style:"fullscreen")
        aspectRatio
      }
      author{
        ...userFields
      }
      reviewList{
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
      commentList(offset:0){
        id
        content
        createdAt
        viewerCanDelete
        author{
          ...userFields
        }
      }
    }
  }
  ${fragments.postFields}
  ${fragments.userFields}
`;
query.userBySlug = gql`
  query ($slug:String!){
    user(slug:$slug){
      ...userFields
    }
  }
  ${fragments.userFields}`;

query.userPostList = gql`
  query ($slug:String!){
    user(slug:$slug){
      id
      postList{
        ...postFields
        photoList{
          ...photoFields
        }
        author{
          ...userFields
        }
      }
    }
  }
  ${fragments.postFields}
  ${fragments.userFields}
  ${fragments.photoFields}`;

query.postsForReview=gql`
  query postsForReview($offset:Int,$size:Int){
    postsForReview(offset:$offset,size:$size){
        ...postFields
        photoList{
          ...photoFields
          aspectRatio
        }
        author{
          ...userFields
        }
    }
  }
  ${fragments.postFields}
  ${fragments.photoFields}
  ${fragments.userFields}
`;
export default query;
