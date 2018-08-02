import { Value } from "slate";

export default {
  Category: [],
  Templates: [
    {
      category: {
        name: "",
        img: ""
      },
      title: "",
      username: "Unknown",
      clap_count: 0,
      view: 0,
      comment_count: 0,
      time: "?",
      cards: [{ type: "builder" }]
    }
  ],
  Posts: [
    {
      category: {
        name: "",
        img: ""
      },
      username: "Unknown",
      clap_count: 0,
      view: 0,
      comment_count: 0,
      time: "?",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      font: null,
      OnDrag: null,
      hasDropped: false,
      hasDroppedOnChild: false,
      contentHover: false,
      selectedIndex: null,
      hoveredIndex: null,
      selectedContent: null,
      title: "?????",
      cards: [
        {
          type: "builder"
        },
        {
          type: "columnList",
          OnDrag: "columnList",
          content: [1],
          columnListArray: [
            [
              {
                type: "builder"
              },
              {
                type: "content",
                OnDrag: "content",
                content: "HTML",
                value: {
                  object: "value",
                  document: {
                    object: "document",
                    data: {},
                    nodes: [
                      {
                        object: "block",
                        type: "paragraph",
                        isVoid: false,
                        data: {},
                        nodes: [
                          {
                            object: "text",
                            leaves: [
                              {
                                object: "leaf",
                                text: "Hello, world!",
                                marks: []
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                }
              },
              {
                type: "builder"
              },
              {
                type: "content",
                OnDrag: "content",
                content: "IMAGE",
                imageSrc:
                  "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif",
                fullWidth: false,
                alt: "Image"
              },
              {
                type: "builder"
              },
              {
                type: "content",
                OnDrag: "content",
                content: "VIDEO",
                videoSrc: "TRmdXDH9b1s"
              },
              {
                type: "builder"
              }
            ]
          ]
        },
        {
          type: "builder"
        }
      ]
    },
    // 0
    {
      category: {
        name: "",
        img: ""
      },
      title: "",
      username: "Unknown",
      clap_count: 0,
      view: 0,
      comment_count: 0,
      time: "?",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [{ type: "builder" }]
    },
    // 1
    {
      category: {
        name: "JAX",
        img: "https://www.mobafire.com/images/avatars/jax-classic.png"
      },
      title: "D4) <시즌8> 전봇대로 뚜까패는 잭스공략",
      username: "Gun",
      clap_count: Math.floor(Math.random() * 100 + 1),
      view: Math.floor(Math.random() * 10000 + 1),
      comment_count: Math.floor(Math.random() * 100 + 1),
      time: "July 31, 2018",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [
        {
          type: "builder"
        },
        {
          type: "columnList",
          OnDrag: "columnList",
          content: [1],
          columnListArray: [
            [
              {
                type: "builder"
              }
            ]
          ]
        },
        {
          type: "builder"
        }
      ]
    },
    // 2
    {
      category: {
        name: "AHRI",
        img: "https://www.mobafire.com/images/avatars/ahri-midnight.png"
      },
      title: "[8.15] 3도류 아리 완벽 공략",
      username: "Gun",
      clap_count: Math.floor(Math.random() * 100 + 1),
      view: Math.floor(Math.random() * 10000 + 1),
      comment_count: Math.floor(Math.random() * 100 + 1),
      time: "2018.07.29",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [
        { type: "builder" },
        {
          type: "columnList",
          content: [1, 1],
          columnListArray: [[{ type: "builder" }], [{ type: "builder" }]]
        },
        { type: "builder" },
        {
          type: "columnList",
          content: [1],
          columnListArray: [
            [
              { type: "builder" },
              {
                type: "content",
                content: "IMAGE",
                fullWidth: false,
                alt: "Image",
                imageSrc:
                  "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif"
              },
              { type: "builder" },
              { type: "content", content: "VIDEO", videoSrc: "TRmdXDH9b1s" },
              { type: "builder" }
            ]
          ]
        },
        { type: "builder" }
      ]
    },
    // 3
    {
      category: {
        name: "Jinx",
        img: "https://www.mobafire.com/images/avatars/jinx-ambitious-elf.png"
      },
      title: "[D1] 총든 미친 여성 공략",
      username: "Gun",
      clap_count: Math.floor(Math.random() * 100 + 1),
      view: Math.floor(Math.random() * 10000 + 1),
      comment_count: Math.floor(Math.random() * 100 + 1),
      time: "2018.07.29",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [
        {
          type: "builder"
        },
        {
          type: "columnList",
          OnDrag: "columnList",
          content: [1],
          columnListArray: [
            [
              {
                type: "builder"
              },
              {
                type: "content",
                OnDrag: "content",
                content: "HTML",
                value: {
                  object: "value",
                  document: {
                    object: "document",
                    data: {},
                    nodes: [
                      {
                        object: "block",
                        type: "paragraph",
                        isVoid: false,
                        data: {},
                        nodes: [
                          {
                            object: "text",
                            leaves: [
                              {
                                object: "leaf",
                                text: "Hello, world!",
                                marks: []
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                }
              },
              {
                type: "builder"
              },
              {
                type: "content",
                OnDrag: "content",
                content: "IMAGE",
                imageSrc:
                  "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif",
                fullWidth: false,
                alt: "Image"
              },
              {
                type: "builder"
              },
              {
                type: "content",
                OnDrag: "content",
                content: "VIDEO",
                videoSrc: "TRmdXDH9b1s"
              },
              {
                type: "builder"
              }
            ]
          ]
        },
        {
          type: "builder"
        }
      ]
    },
    {
      category: {
        name: "Ryze",
        img: "https://www.mobafire.com/images/avatars/ryze-professor.png"
      },
      title: "2000++) 대머리를 건드리면 ㅈ되는거야",
      username: "Gun",
      clap_count: Math.floor(Math.random() * 100 + 1),
      view: Math.floor(Math.random() * 10000 + 1),
      comment_count: Math.floor(Math.random() * 100 + 1),
      time: "2018.07.29",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [
        { type: "builder" },
        {
          type: "columnList",
          content: [1, 1],
          columnListArray: [[{ type: "builder" }], [{ type: "builder" }]]
        },
        { type: "builder" },
        {
          type: "columnList",
          content: [1],
          columnListArray: [
            [
              { type: "builder" },
              {
                type: "content",
                content: "IMAGE",
                fullWidth: false,
                alt: "Image",
                imageSrc:
                  "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif"
              },
              { type: "builder" },
              { type: "content", content: "VIDEO", videoSrc: "TRmdXDH9b1s" },
              { type: "builder" }
            ]
          ]
        },
        { type: "builder" }
      ]
    },
    {
      category: {
        name: "Nar",
        img: "https://www.mobafire.com/images/avatars/gnar-dino.png"
      },
      title: "D1) 커여운 나르 키우기",
      username: "Gun",
      clap_count: Math.floor(Math.random() * 100 + 1),
      view: Math.floor(Math.random() * 10000 + 1),
      comment_count: Math.floor(Math.random() * 100 + 1),
      time: "2018.07.29",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [
        { type: "builder" },
        {
          type: "columnList",
          content: [1, 1],
          columnListArray: [[{ type: "builder" }], [{ type: "builder" }]]
        },
        { type: "builder" },
        {
          type: "columnList",
          content: [1],
          columnListArray: [
            [
              { type: "builder" },
              {
                type: "content",
                content: "IMAGE",
                fullWidth: false,
                alt: "Image",
                imageSrc:
                  "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif"
              },
              { type: "builder" },
              { type: "content", content: "VIDEO", videoSrc: "TRmdXDH9b1s" },
              { type: "builder" }
            ]
          ]
        },
        { type: "builder" }
      ]
    },
    {
      category: {
        name: "Teemo",
        img: "https://www.mobafire.com/images/avatars/teemo-classic.png"
      },
      title: "1800++] 이제는 당신이 찢겨야 할 때...",
      username: "Gun",
      clap_count: Math.floor(Math.random() * 100 + 1),
      view: Math.floor(Math.random() * 10000 + 1),
      comment_count: Math.floor(Math.random() * 100 + 1),
      time: "2018.07.29",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [
        { type: "builder" },
        {
          type: "columnList",
          content: [1, 1],
          columnListArray: [[{ type: "builder" }], [{ type: "builder" }]]
        },
        { type: "builder" },
        {
          type: "columnList",
          content: [1],
          columnListArray: [
            [
              { type: "builder" },
              {
                type: "content",
                content: "IMAGE",
                fullWidth: false,
                alt: "Image",
                imageSrc:
                  "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif"
              },
              { type: "builder" },
              { type: "content", content: "VIDEO", videoSrc: "TRmdXDH9b1s" },
              { type: "builder" }
            ]
          ]
        },
        { type: "builder" }
      ]
    },
    {
      category: {
        name: "Jhin",
        img: "https://www.mobafire.com/images/avatars/jhin-classic.png"
      },
      title: "1000++) 원딜의 마지막 희망 진 공략",
      username: "Gun",
      clap_count: Math.floor(Math.random() * 100 + 1),
      view: Math.floor(Math.random() * 10000 + 1),
      comment_count: Math.floor(Math.random() * 100 + 1),
      time: "2018.07.29",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [
        { type: "builder" },
        {
          type: "columnList",
          content: [1, 1],
          columnListArray: [[{ type: "builder" }], [{ type: "builder" }]]
        },
        { type: "builder" },
        {
          type: "columnList",
          content: [1],
          columnListArray: [
            [
              { type: "builder" },
              {
                type: "content",
                content: "IMAGE",
                fullWidth: false,
                alt: "Image",
                imageSrc:
                  "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif"
              },
              { type: "builder" },
              { type: "content", content: "VIDEO", videoSrc: "TRmdXDH9b1s" },
              { type: "builder" }
            ]
          ]
        },
        { type: "builder" }
      ]
    },
    {
      category: {
        name: "Janna",
        img: "https://www.mobafire.com/images/avatars/janna-frost-queen.png"
      },
      title: "발암의 힘 느껴보기",
      username: "Gun",
      clap_count: Math.floor(Math.random() * 100 + 1),
      view: Math.floor(Math.random() * 10000 + 1),
      comment_count: Math.floor(Math.random() * 100 + 1),
      time: "2018.07.29",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [
        { type: "builder" },
        {
          type: "columnList",
          content: [1, 1],
          columnListArray: [[{ type: "builder" }], [{ type: "builder" }]]
        },
        { type: "builder" },
        {
          type: "columnList",
          content: [1],
          columnListArray: [
            [
              { type: "builder" },
              {
                type: "content",
                content: "IMAGE",
                fullWidth: false,
                alt: "Image",
                imageSrc:
                  "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif"
              },
              { type: "builder" },
              { type: "content", content: "VIDEO", videoSrc: "TRmdXDH9b1s" },
              { type: "builder" }
            ]
          ]
        },
        { type: "builder" }
      ]
    },
    {
      category: {
        name: "Thresh",
        img: "https://www.mobafire.com/images/avatars/thresh-classic.png"
      },
      title: "영혼 마시쩡",
      username: "Gun",
      clap_count: Math.floor(Math.random() * 100 + 1),
      view: Math.floor(Math.random() * 10000 + 1),
      comment_count: Math.floor(Math.random() * 100 + 1),
      time: "2018.07.29",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [
        { type: "builder" },
        {
          type: "columnList",
          content: [1, 1],
          columnListArray: [[{ type: "builder" }], [{ type: "builder" }]]
        },
        { type: "builder" },
        {
          type: "columnList",
          content: [1],
          columnListArray: [
            [
              { type: "builder" },
              {
                type: "content",
                content: "IMAGE",
                fullWidth: false,
                alt: "Image",
                imageSrc:
                  "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif"
              },
              { type: "builder" },
              { type: "content", content: "VIDEO", videoSrc: "TRmdXDH9b1s" },
              { type: "builder" }
            ]
          ]
        },
        { type: "builder" }
      ]
    },
    {
      category: {
        name: "Alistar",
        img: "https://www.mobafire.com/images/avatars/alistar-unchained.png"
      },
      title: "[D2] 화난 소는 누구도 막을 수 없으센",
      username: "Gun",
      clap_count: Math.floor(Math.random() * 100 + 1),
      view: Math.floor(Math.random() * 10000 + 1),
      comment_count: Math.floor(Math.random() * 100 + 1),
      time: "2018.07.29",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [
        { type: "builder" },
        {
          type: "columnList",
          content: [1, 1],
          columnListArray: [[{ type: "builder" }], [{ type: "builder" }]]
        },
        { type: "builder" },
        {
          type: "columnList",
          content: [1],
          columnListArray: [
            [
              { type: "builder" },
              {
                type: "content",
                content: "IMAGE",
                fullWidth: false,
                alt: "Image",
                imageSrc:
                  "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif"
              },
              { type: "builder" },
              { type: "content", content: "VIDEO", videoSrc: "TRmdXDH9b1s" },
              { type: "builder" }
            ]
          ]
        },
        { type: "builder" }
      ]
    },
    {
      category: {
        name: "Blitzcrank",
        img: "https://www.mobafire.com/images/avatars/blitzcrank-classic.png"
      },
      title: "인형뽑기 함 허쉴?",
      username: "Gun",
      clap_count: Math.floor(Math.random() * 100 + 1),
      view: Math.floor(Math.random() * 100000 + 1),
      comment_count: Math.floor(Math.random() * 100 + 1),
      time: "2018.07.29",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [
        { type: "builder" },
        {
          type: "columnList",
          content: [1, 1],
          columnListArray: [[{ type: "builder" }], [{ type: "builder" }]]
        },
        { type: "builder" },
        {
          type: "columnList",
          content: [1],
          columnListArray: [
            [
              { type: "builder" },
              {
                type: "content",
                content: "IMAGE",
                fullWidth: false,
                alt: "Image",
                imageSrc:
                  "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif"
              },
              { type: "builder" },
              { type: "content", content: "VIDEO", videoSrc: "TRmdXDH9b1s" },
              { type: "builder" }
            ]
          ]
        },
        { type: "builder" }
      ]
    },
    {
      category: {
        name: "Aatrox",
        img: "https://www.mobafire.com/images/avatars/aatrox-classic.png"
      },
      title: "1600++ 지옥에서 돌아온 아트록스 공략",
      username: "Gun",
      clap_count: Math.floor(Math.random() * 100 + 1),
      view: Math.floor(Math.random() * 10000 + 1),
      comment_count: Math.floor(Math.random() * 100 + 1),
      time: "2018.07.29",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [
        { type: "builder" },
        {
          type: "columnList",
          content: [1, 1],
          columnListArray: [[{ type: "builder" }], [{ type: "builder" }]]
        },
        { type: "builder" },
        {
          type: "columnList",
          content: [1],
          columnListArray: [
            [
              { type: "builder" },
              {
                type: "content",
                content: "IMAGE",
                fullWidth: false,
                alt: "Image",
                imageSrc:
                  "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif"
              },
              { type: "builder" },
              { type: "content", content: "VIDEO", videoSrc: "TRmdXDH9b1s" },
              { type: "builder" }
            ]
          ]
        },
        { type: "builder" }
      ]
    },
    {
      category: {
        name: "Quinn",
        img: "https://www.mobafire.com/images/avatars/quinn-woad-scout.png"
      },
      title: "1600++ 발러와 함께하는 신나는 여행",
      username: "Gun",
      clap_count: Math.floor(Math.random() * 100 + 1),
      view: Math.floor(Math.random() * 10000 + 1),
      comment_count: Math.floor(Math.random() * 100 + 1),
      time: "2018.07.29",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [
        { type: "builder" },
        {
          type: "columnList",
          content: [1, 1],
          columnListArray: [[{ type: "builder" }], [{ type: "builder" }]]
        },
        { type: "builder" },
        {
          type: "columnList",
          content: [1],
          columnListArray: [
            [
              { type: "builder" },
              {
                type: "content",
                content: "IMAGE",
                fullWidth: false,
                alt: "Image",
                imageSrc:
                  "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif"
              },
              { type: "builder" },
              { type: "content", content: "VIDEO", videoSrc: "TRmdXDH9b1s" },
              { type: "builder" }
            ]
          ]
        },
        { type: "builder" }
      ]
    },
    {
      category: {
        name: "Singed",
        img: "https://www.mobafire.com/images/avatars/singed-classic.png"
      },
      title: "머머리 뽕쟁이 아조씨",
      username: "Gun",
      clap_count: Math.floor(Math.random() * 100 + 1),
      view: Math.floor(Math.random() * 10000 + 1),
      comment_count: Math.floor(Math.random() * 100 + 1),
      time: "2018.07.29",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [
        { type: "builder" },
        {
          type: "columnList",
          content: [1, 1],
          columnListArray: [[{ type: "builder" }], [{ type: "builder" }]]
        },
        { type: "builder" },
        {
          type: "columnList",
          content: [1],
          columnListArray: [
            [
              { type: "builder" },
              {
                type: "content",
                content: "IMAGE",
                fullWidth: false,
                alt: "Image",
                imageSrc:
                  "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif"
              },
              { type: "builder" },
              { type: "content", content: "VIDEO", videoSrc: "TRmdXDH9b1s" },
              { type: "builder" }
            ]
          ]
        },
        { type: "builder" }
      ]
    },
    {
      category: {
        name: "Sona",
        img: "https://www.mobafire.com/images/avatars/sona-silent-night.png"
      },
      title: "D5] 소나 완벽 공략 ( 크레센도 팁 추가 )",
      username: "Gun",
      clap_count: Math.floor(Math.random() * 100 + 1),
      view: Math.floor(Math.random() * 10000 + 1),
      comment_count: Math.floor(Math.random() * 100 + 1),
      time: "2018.07.29",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [
        { type: "builder" },
        {
          type: "columnList",
          content: [1, 1],
          columnListArray: [[{ type: "builder" }], [{ type: "builder" }]]
        },
        { type: "builder" },
        {
          type: "columnList",
          content: [1],
          columnListArray: [
            [
              { type: "builder" },
              {
                type: "content",
                content: "IMAGE",
                fullWidth: false,
                alt: "Image",
                imageSrc:
                  "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif"
              },
              { type: "builder" },
              { type: "content", content: "VIDEO", videoSrc: "TRmdXDH9b1s" },
              { type: "builder" }
            ]
          ]
        },
        { type: "builder" }
      ]
    },
    {
      category: {
        name: "Vi",
        img: "https://www.mobafire.com/images/avatars/vi-classic.png"
      },
      title: "바이 정글 공략",
      username: "Gun",
      clap_count: Math.floor(Math.random() * 100 + 1),
      view: Math.floor(Math.random() * 10000 + 1),
      comment_count: Math.floor(Math.random() * 100 + 1),
      time: "2018.07.29",
      rightMenu: null,
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      contentWidth: 600,
      cards: [
        { type: "builder" },
        {
          type: "columnList",
          content: [1, 1],
          columnListArray: [[{ type: "builder" }], [{ type: "builder" }]]
        },
        { type: "builder" },
        {
          type: "columnList",
          content: [1],
          columnListArray: [
            [
              { type: "builder" },
              {
                type: "content",
                content: "IMAGE",
                fullWidth: false,
                alt: "Image",
                imageSrc:
                  "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif"
              },
              { type: "builder" },
              { type: "content", content: "VIDEO", videoSrc: "TRmdXDH9b1s" },
              { type: "builder" }
            ]
          ]
        },
        { type: "builder" }
      ]
    }
  ]
};
