import { compareTwoStrings } from "string-similarity";
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
            matchArray.push({ post, matchPercent, keyword });
          }
        });
      }
    }
  });
  console.log(matchArray);
  const uniqueMatchArray = [
    ...new Map(matchArray.map((item) => [item.post.keyword, item])).values(),
  ];
  console.log(uniqueMatchArray);
  return matchArray;
}

export { searchKeywords };
