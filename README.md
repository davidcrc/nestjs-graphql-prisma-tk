<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Nestjs API for Tk <a href="https://github.com/davidcrc/nextjs-graphql-zustand-tk" >FRONT</a>  </p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[FRONT](https://github.com/davidcrc/nextjs-graphql-zustand-tk) API for TK

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## TODO:

- Restrict on some endpoints some fields , like user

## EndPoints

```graphql
mutation RegisterUser(
  $fullname: String!
  $email: String!
  $password: String!
  $confirmPassword: String!
) {
  register(
    registerInput: {
      fullname: $fullname
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    }
  ) {
    user {
      id
      uuid
      fullname
      email
    }
  }
}

{
  "fullname": "name",
  "email": "jc4@example.co",
  "password": "12345678",
  "confirmPassword": "12345678"
}
```

```graphql
mutation LoginUser($email: String!, $password: String!) {
  login(loginInput: { email: $email, password: $password }) {
    user {
      id
      email
      uuid
      fullname
      bio
      image
    }
  }
}

{
  "email": "jc4@example.co",
  "password": "12345678"
}
```

```graphql
mutation LogoutUser {
  logout
}
```

```graphql
query GetUsers {
  getUsers {
    id
    fullname
    email
    image
  }
}
```

```graphql
query GetUsers {
  getUsers {
    id
    fullname
    email
    image
    bio
  }
}
```

```graphql
mutation CreatePost($text: String!, $video: Upload!) {
  createPost(text: $text, video: $video) {
    id
    text
    video
  }
}
```

```graphql
query GetPosts($skip: Int!, $take: Int!) {
  getPosts(skip: $skip, take: $take) {
    id
    text
    video
    user {
      id
      uuid
      fullname
      email
    }
    likes {
      id
      userId
      postId
    }
  }
}
```

```graphql
query GetCommentsByPostId($postId: Float!) {
  getCommentsByPostId(postId: $postId) {
    id
    text
    createdAt
    user {
      id
      fullname
      email
    }
    post {
      id
      text
      video
    }
  }
}
```

```graphql
mutation DeleteComment($id: Float!) {
  deleteComment(id: $id) {
    id
    __typename
  }
}
```

```graphql
mutation LikePost($postId: Float!) {
  likePost(postId: $postId) {
    id
    userId
    postId
  }
}
```

```graphql
query GetPostById($id: Float!) {
  getPostById(id: $id) {
    id
    text
    video
    createdAt
    user {
      id
      email
      fullname
    }
    likes {
      id
      userId
      postId
    }
    otherPostIds
  }
}
```

```graphql
mutation CreateComment($text: String!, $postId: Float!) {
  createComment(text: $text, postId: $postId) {
    text
    id
    createdAt
    user {
      id
      fullname
      email
    }
    post {
      id
      text
      video
    }
  }
}
```

```graphql
mutation UnlikePost($postId: Float!) {
  unlikePost(postId: $postId) {
    id
    userId
    postId
  }
}
```

```graphql
query getPostsByUserId($userUUID: String!) {
  getPostsByUserId(userUUID: $userUUID) {
    id
    text
    video
    user {
      fullname
      email
      id
    }
  }
}
```

```graphql
mutation UpdateUserProfile($fullname: String!, $bio: String!, $image: Upload) {
  updateUserProfile(fullname: $fullname, bio: $bio, image: $image) {
    id
    fullname
    bio
    image
  }
}
```
