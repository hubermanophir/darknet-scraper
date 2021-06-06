const axios = require("axios");
const cheerio = require("cheerio");
const Post = require("../schemas/Post");

const getAll = async (req, res) => {
  const response = await axios.get("http://nzxj65x32vh2fkhk.onion/all", {
    proxy: {
      host: "localhost",
      port: 8118,
    },
  });
  const $ = cheerio.load(response.data);
  const rows = [];
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

    rows.push(obj);
  });
  rows.shift();
  rows.pop();

  rows.forEach(async (row) => {
    const savedPost = await Post.find({ content: row.content });
    // console.log(savedPost)
    if (savedPost.length === 0) {
      savedPost;
      const post = new Post({
        author: row.author,
        title: row.title,
        date: new Date(row.date),
        content: row.content,
      });
      try {
        await post.save();
      } catch (err) {
        res.status(500).json({ message: `Internal error ${err}` });
      }
    }
  });

  res.status(200).json({ message: "Scraping done" });
};

const sendClient = async (req, res) => {
  const savedPosts = await Post.find({});
  if (savedPosts.length === 0) {
    res.status(200).json({ message: "No posts found" });
  } else {
    res.status(400).json(savedPosts);
  }
};

module.exports = { getAll, sendClient };
