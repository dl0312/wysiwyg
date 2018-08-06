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
            hoverImage
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
            hoverImage
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
          hoverImage
        }
      }
    }
  }
`;

export const CATEGORY = gql`
  query GetCategoryById($categoryId: Int!) {
    GetCategoryById(categoryId: $categoryId) {
      ok
      error
      category {
        id
        name
        wikiImages {
          shownImage {
            url
          }
          hoverImage
        }
        parent {
          name
          id
          wikiImages {
            shownImage {
              url
            }
            hoverImage
          }
        }
        children {
          name
          id
          wikiImages {
            shownImage {
              url
            }
            hoverImage
          }
        }
      }
    }
  }
`;
