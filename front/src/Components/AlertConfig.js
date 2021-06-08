import { Button, TextField } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import ChipsArray from "./ChipsArray";

export default function AlertConfig({ user }) {
  const [keywords, setKeywords] = useState(user.keywords);
  const [chipData, setChipData] = useState([]);
  const keywordRef = useRef();
  const intervalRef = useRef();

  useEffect(() => {
    const keywordsWithKey = keywords.map((word, i) => {
      return {
        key: i,
        label: word,
      };
    });
    setChipData(keywordsWithKey);
  }, []);

  const addKeywordHandler = () => {
    console.log(chipData.length);
    if (chipData.length > 0) {
      for (const chip of chipData) {
        if (chip.label === keywordRef.current.value) {
          return;
        }
      }
    }
    const word = {
      key: chipData[chipData.length - 1]
        ? chipData[chipData.length - 1].key + 1
        : 0,
      label: keywordRef.current.value,
    };
    const temp = [...chipData];
    temp.push(word);
    setChipData(temp);
  };

  return (
    <div>
      <h1>Alert config</h1>
      <div>
        <TextField label="Interval" inputRef={intervalRef} />
        <span>Current Interval: {user && user.searchInterval}</span>
      </div>
      <h3>KeyWords</h3>
      {user && (
        <ChipsArray
          keywords={keywords}
          setKeywords={setKeywords}
          chipData={chipData}
          setChipData={setChipData}
        />
      )}
      <TextField label="Keyword" inputRef={keywordRef} />
      <Button onClick={addKeywordHandler}>Add Keyword</Button>
      <div>
        <Button variant="contained">Save Configuration</Button>
      </div>
    </div>
  );
}
