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
    ]
  ]
};
