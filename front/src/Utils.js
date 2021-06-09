import { compareTwoStrings } from "string-similarity";
import uniqueObjects from "unique-objects";

function searchKeywords(keywords, posts) {
  // console.log(keywords)
  // console.log(posts)
  const matchArray = [];
  keywords.forEach((keyword) => {
    for (const post of posts) {
      const wordsArray = JSON.stringify(post)
        .replace(/[^a-zA-Z]/g, " ")
        .split(" ");
      if (wordsArray.length > 0) {
        wordsArray.forEach((word) => {
          const cleanWord = word.replace(/[^a-zA-Z]/g, "");
          const matchPercent = compareTwoStrings(keyword, cleanWord);
          if (matchPercent >= 0.65) {
            // console.log(matchPercent)
            matchArray.push({
              post,
              matchPercent,
              keyword,
              content: post.content,
            });
          }
        });
      }
    }
  });

  const uniqueMatchArray = uniqueObjects(matchArray, ["content"]);
  console.log(matchArray);
  console.log(uniqueMatchArray);
  return uniqueMatchArray;
}

export { searchKeywords };
