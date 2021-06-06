const axios = require("axios");
const cheerio = require("cheerio");

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
        // console.log(j);
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
  console.log(rows);
  res.send(response.data);
};

module.exports = { getAll };
