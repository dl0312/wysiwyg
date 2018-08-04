import gql from "graphql-tag";

export const HOME_PAGE = gql`
  {
    movies(limit: 50, rating: 7) {
      id
      title
      rating
      medium_cover_image
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

export const MOVIE_DETAILS = gql`
  query getMovieDetails($movieId: Int!) {
    movie(id: $movieId) {
      medium_cover_image
      title
      rating
      description_intro
      language
      genres
    }
    suggestions(id: $movieId) {
      id
      title
      rating
      medium_cover_image
    }
  }
`;
