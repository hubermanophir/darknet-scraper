import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ChipsArray from "./ChipsArray";

export default function AlertConfig({ user, setsUser }) {
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

  const areEqual = (first, second) => {
    if (first.length !== second.length) {
      return false;
    }
    for (let i = 0; i < first.length; i++) {
      if (!second.includes(first[i])) {
        return false;
      }
    }
    return true;
  };

  const addKeywordHandler = () => {
    if (keywordRef.current.value === "") {
      return;
    }
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
    keywordRef.current.value = "";
  };
  const saveHandler = async () => {
    try {
      const newArr = chipData.map((data) => {
        return data.label;
      });
      const bool = areEqual(newArr, user.keywords);
      const newUser = Object.assign({}, user);
      if (!bool) {
        await axios.put(`http://${window.location.hostname}:8080/api/user/update_keywords`, {
          uid: user._id,
          keywords: newArr,
        });
        newUser.keywords = newArr;
      }
      if (intervalRef.current.value !== "") {
        await axios.put(`http://${window.location.hostname}:8080/api/user/update_interval`, {
          uid: user._id,
          interval: intervalRef.current.value,
        });
        newUser.searchInterval = intervalRef.current.value;
      }
      setsUser(newUser);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1 className="alert-config-title">Alert config</h1>
      <div className="alert-config-div-container">
        <div className="interval-container">
          <TextField label="Interval" inputRef={intervalRef} />
          <span className="current-interval">Current Interval: {user && user.searchInterval}</span>
        </div>
        <div className="keyword-div-container">
          {user && (
            <ChipsArray
              keywords={keywords}
              setKeywords={setKeywords}
              chipData={chipData}
              setChipData={setChipData}
            />
          )}
          <div className="keyword-input-container">
            <TextField
              className="keyword-input"
              label="Keyword"
              inputRef={keywordRef}
            />
            <Button className="add-keyword-button" onClick={addKeywordHandler}>
              Add Keyword
            </Button>
          </div>
        </div>
        <div className="save-container-div">
          <Button onClick={saveHandler} variant="contained">
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
