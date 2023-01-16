import "./App.css";
import { useEffect, useState } from "react";
import Box from "./components/Box";

const WORD_OF_DAY = "FROCK";

function App() {
  const [words, setWords] = useState(
    Array(6).fill(Array(5).fill({ letter: "", background: "" }))
  );
  const [row, setRow] = useState(0);

  async function isWordValid(word) {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    return response.status !== 404;
  }

  async function handleInput(e) {
    console.log("w", words[row]);
    const word = words[row].map(({ letter }) => letter).join("");
    const wordLength = word.length;
    if (row > 0) {
      const allGreen = words[row - 1].filter(
        ({ background }) => background === "#538d4e"
      );
      if (allGreen.length === 5) return;
    }

    if (e.key === "Backspace" && wordLength > 0) {
      const updatedSetOfWords = words.map((word) => word.slice());
      updatedSetOfWords[row][wordLength - 1] = { letter: "", background: "" };
      setWords(updatedSetOfWords);
    } else if (e.key === "Enter") {
      if (wordLength < 5) {
        alert("Not Enough Letters");
      } else {
        const isWordCorrect = await isWordValid(word);
        if (isWordCorrect) {
          const updatedWordBackground = words.map((word) => word.slice());
          const letterMap = {};

          WORD_OF_DAY.split("").forEach((letter, index) => {
            letterMap[letter.toLowerCase()] = letterMap[letter.toLowerCase()]
              ? letterMap[letter.toLowerCase()] + 1
              : 1;
          });
          word.split("").forEach((letter, index) => {
            if (letter.toLowerCase() === WORD_OF_DAY[index].toLowerCase()) {
              console.log("ins", letter, letterMap[letter]);
              letterMap[letter] -= 1;
            }
          });
          updatedWordBackground[row] = updatedWordBackground[row].map(
            ({ letter }, index) => {
              let background = "";
              if (letter.toLowerCase() === WORD_OF_DAY[index].toLowerCase()) {
                background = "#538d4e";
              } else background = "#3a3a3c";

              if (letterMap[letter] > 0 && background !== "#538d4e") {
                console.log("in");
                background = "#b59f3b";
                letterMap[letter] -= 1;
              }
              return { letter, background, border: "none" };
            }
          );
          setWords(updatedWordBackground);
          setRow(row + 1);
        } else {
          console.log("lol");
          alert("Word is not Valid");
        }
      }
    } else if (
      e.key.length === 1 &&
      e.key.toUpperCase() >= "A" &&
      e.key.toUpperCase() <= "Z"
    ) {
      if (wordLength !== 5) {
        const updatedSetOfWords = words.map((word) => word.slice());
        updatedSetOfWords[row][wordLength] = { letter: e.key, background: "" };
        setWords(updatedSetOfWords);
      }
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", handleInput);
    return () => window.removeEventListener("keydown", handleInput);
  }, [words, row]);

  return (
    <div className="App">
      <div className="App-header">
        {words.map((characters, index) => (
          <div className="box_row">
            {characters.map(({ letter, background, border }, index) => {
              return (
                <Box
                  displayText={letter}
                  background={background}
                  border={border}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
