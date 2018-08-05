import gql from "graphql-tag";

export const POST = gql`
  query GetPostById($postId: Int!) {
    GetPostById(postId: $postId) {
      ok
      error
      post {
        title
        body
        category {
          wikiImages {
            name
            shownImage {
              url
            }
            hoverImage {
              url
            }
          }
        }
        font
        contentWidth
        view
        user {
          fullName
        }
        clapsCount
        commentsCount
        comments {
          user {
            fullName
          }
          body
          createdAt
        }
        createdAt
      }
    }
  }
`;

export const CATEGORIES = gql`
  query GetCategoriesByKeyword($keyword: String!) {
    GetCategoriesByKeyword(keyword: $keyword) {
      ok
      error
      categories {
        id
        name
        wikiImages {
          id
          shownImage {
            url
          }
          hoverImage {
            url
          }
        }
      }
    }
  }
`;

export const POSTS = gql`
  {
    GetAllPosts(limit: 20) {
      ok
      error
      posts {
        title
        id
        user {
          fullName
        }
        category {
          id
          name
          wikiImages {
            shownImage {
              url
            }
            hoverImage {
              url
            }
          }
        }
        commentsCount
        clapsCount
        view
        createdAt
      }
    }
  }
`;
