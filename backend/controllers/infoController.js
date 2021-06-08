const axios = require("axios");
const cheerio = require("cheerio");
const differenceBy = require("lodash/differenceBy");
const Post = require("../schemas/Post");

const getAll = async () => {
  try {
    const response = await axios.get("http://nzxj65x32vh2fkhk.onion/all", {
      proxy: {
        host: "localhost",
        port: 8118,
      },
    });
    const $ = cheerio.load(response.data);
    const posts = [];
    $(".col-sm-12").each((i, row) => {
      const obj = {};
      $(row)
        .children()
        .each((j, element) => {
          switch (j) {
            case 0:
              const str = $(element)
                .children()
                .first()
                .children()
                .first()
                .text()
                .replace(/\t/g, "");
              obj.title = str.replace(/\n/g, "");
              break;

            case 1:
              const ol = $(element).children().first().children().first();
              const liArray = [];
              $(ol)
                .children()
                .each((i, li) => {
                  liArray.push($(li).text());
                });
              obj.content = liArray
                .toString()
                .replace(/,/g, ", ")
                .replace(/\s\s+/g, " ");
              break;

            case 2:
              const dateAuthorString = $(element)
                .children()
                .first()
                .children()
                .first()
                .text();
              const arr = dateAuthorString.split(" at ");
              const author = arr[0].split("by ")[1];
              const date = arr[1].replace(/\n/g, "").replace(/\t/g, "");
              obj.date = date;
              if (
                author === "Guest" ||
                author === "Unknown" ||
                author === "Anonymous"
              ) {
                obj.author = "Anonymous";
              } else {
                obj.author;
              }
              break;
          }
        });

      posts.push(obj);
    });
    posts.shift();
    posts.pop();
    for (const post of posts) {
      const savedPost = await Post.find({
        content: post.content,
        title: post.title,
        date: new Date(post.date),
      });
      if (savedPost.length === 0) {
        try {
          await Post.create({
            author: post.author,
            title: post.title,
            date: new Date(post.date),
            content: post.content,
          });
        } catch (err) {
          throw new Error(err);
        }
      }
      post.date = `${new Date(post.date)}`;
    }

    const savedPosts = await Post.find().sort({ date: -1 }).limit(15);
    const normalizedSavedPosts = savedPosts.map((post) => {
      return {
        title: post.title,
        content: post.content,
        date: `${post.date}`,
        author: post.author,
      };
    });

    // console.log(normalizedSavedPosts);
    // console.log("------------------------------------------------------------");
    // console.log(posts);

    const newArray = uniqueArray(posts, normalizedSavedPosts);

    const successMessageObj = {
      newArray,
      message: "success",
      numberOfNew: newArray.length,
    };

    io.sockets.emit("didWork", successMessageObj);
  } catch (error) {
    const failMessageObj = {
      message: "fail",
    };
    io.sockets.emit("didWork", failMessageObj);
  }
};

// const scrape = async (req, res) => {
//   const savedPosts = await Post.find({});
//   const newPosts = await getAll();
//   if (newPosts.length !== savedPosts.length) {
//     const newArray = uniqueArray(newPosts, savedPosts);
//     return res.status(200).json({
//       numberOfNew: newPosts.length - savedPosts.length,
//       newPosts: newArray,
//     });
//   } else {
//     return res.status(200).json({ message: "No new posts" });
//   }
// };

const sendClient = async (req, res) => {
  const savedPosts = await Post.find({});
  if (savedPosts.length === 0) {
    res.status(404).json({ message: "No posts found" });
  } else {
    const sorted = savedPosts.sort((a, b) => b.date - a.date);
    res.status(200).json(sorted);
  }
};

function uniqueArray(newArray, oldArray) {
  return differenceBy(newArray, oldArray, "title");
}

module.exports = { sendClient, getAll };
