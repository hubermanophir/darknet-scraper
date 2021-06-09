import { compareTwoStrings } from "string-similarity";
function searchKeywords(keywords, posts) {
  const matchArray = [];
  keywords.forEach((keyword) => {
    for (const post of posts) {
      const wordsArray = JSON.stringify(post).split(" ");
      if (wordsArray.length > 0) {
        wordsArray.forEach((word) => {
          const cleanWord = word.replace(/[^a-zA-Z]/g, "");
          const matchPercent = compareTwoStrings(keyword, cleanWord);
          if (matchPercent >= 0.65) {
            matchArray.push({ post, matchPercent, keyword });
          }
        });
      }
    }
  });
  const uniqueMatchArray = [...new Set(matchArray)];
  return uniqueMatchArray;
}

export { searchKeywords };
