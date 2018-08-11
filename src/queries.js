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
          clapsCount
          postsCount
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

export const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!, $parentIds: [Int], $childrenIds: [Int]) {
    AddCategory(name: $name, parentIds: $parentIds, childrenIds: $childrenIds) {
      ok
      error
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation EmailSignIn($email: String!, $password: String!) {
    EmailSignIn(email: $email, password: $password) {
      ok
      error
      token
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation EmailSignUp(
    $nickName: String!
    $email: String!
    $password: String!
    $phoneNumber: String!
  ) {
    EmailSignUp(
      nickName: $nickName
      email: $email
      password: $password
      phoneNumber: $phoneNumber
    ) {
      ok
      error
    }
  }
`;
