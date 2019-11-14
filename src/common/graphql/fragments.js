import gql from 'graphql-tag'

const fragments = {
  postFields: `
      fragment postFields on Post {
        id
        slug
        status
        content
        tags
        likes
        reviews
        comments
        createdAt
      } 
    `,
  userFields : `
    fragment userFields on User {
      id
      name
      slug
      avatar
    }`,
  photoFields : `
    fragment photoFields on Media{
      id
      url
      aspectRatio
    }
  `
};

export default fragments;
