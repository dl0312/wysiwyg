import { Value } from "slate";

export default {
  TEMPLATE: [
    // ex 1
    [{ type: "builder" }],

    // ex2
    [
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
              imageSrc: "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif"
            },
            { type: "builder" },
            { type: "content", content: "VIDEO", videoSrc: "TRmdXDH9b1s" },
            { type: "builder" }
          ]
        ]
      },
      { type: "builder" }
    ],
    // button
    [
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
              imageSrc: "https://media.giphy.com/media/A6aHBCFqlE0Rq/giphy.gif",
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
  ]
};
