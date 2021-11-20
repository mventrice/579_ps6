import { useState, useRef } from 'react';

function RhymeFinderApp() {
  const inputEl = useRef(null);
  const [rhymes_list, setRhymes_list] = useState([]);
  const [description, setDescription] = useState('');
  const [synonyms_list, setSynonyms_list] = useState('');
  const [rhymesVisible, setRhymesVisible] = useState(false);
  const [synonymsVisible, setSynonymsVisible] =
    useState(false);

  function groupBy(objects, property) {
    // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
    // value for property (obj[property])
    if (typeof property !== 'function') {
      const propName = property;
      property = (obj) => obj[propName];
    }

    const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
    for (const object of objects) {
      const groupName = property(object);
      //Make sure that the group exists
      if (!groupedObjects.has(groupName)) {
        groupedObjects.set(groupName, []);
      }
      groupedObjects.get(groupName).push(object);
    }

    // Create an object with the results. Sort the keys so that they are in a sensible "order"
    const result = {};
    for (const key of Array.from(
      groupedObjects.keys()
    ).sort()) {
      result[key] = groupedObjects.get(key);
    }
    return result;
  }

  function getRhymes(rel_rhy, callback) {
    fetch(
      `https://api.datamuse.com/words?${new URLSearchParams(
        { rel_rhy }
      ).toString()}`
    )
      .then((response) => response.json())
      .then(
        (data) => {
          callback(data);
        },
        (err) => {
          console.error(err);
        }
      );
  }

  function getSynonyms(ml, callback) {
    fetch(
      `https://api.datamuse.com/words?${new URLSearchParams(
        { ml }
      ).toString()}`
    )
      .then((response) => response.json())
      .then(
        (data) => {
          callback(data);
        },
        (err) => {
          console.error(err);
        }
      );
  }

  let savedWords = [];
  const [savedWordsOutput, setSavedWordsOutput] =
    useState(null);
  function saveWord(newWord) {
    if (savedWordsOutput) {
      savedWords = savedWordsOutput.split(', ');
      savedWords.push(newWord);
      console.log(savedWordsOutput);
    } else {
      savedWords.push(newWord);
    }
    setSavedWordsOutput(savedWords.join(', ')); //returns list as string and resets savedWordsOutput
    console.log(savedWordsOutput);
  }

  function showRhymes() {
    showRhymeDescription(inputEl.current.value);
    getRhymes(inputEl.current.value, (results) => {
      setRhymes_list(results);
    });
  }

  function showSynonyms() {
    showSynonymDescription(inputEl.current.value);
    getSynonyms(inputEl.current.value, (results) => {
      // setInputWord(inputEl.current.value);
      setSynonyms_list(results);
    });
  }

  function showRhymeDescription(inputWord) {
    setDescription(
      'Words that rhyme with ' + inputWord + ':'
    );
  }

  function showSynonymDescription(inputWord) {
    setDescription(
      'Words that have a similar meaning to ' +
        inputWord +
        ':'
    );
  }

  let sylElement = null;
  const groups = groupBy(rhymes_list, 'numSyllables');
  const rhymes_elements = [];

  for (let obj in groups) {
    obj = parseInt(obj);
    if (obj > 1) {
      sylElement = <h3>{obj} syllables</h3>;
    } else {
      sylElement = <h3>{obj} syllable</h3>;
    }
    rhymes_elements.push(sylElement);
    for (const item of groups[obj]) {
      const list_el = (
        <li key={item.word}>
          {item.word}{' '}
          <button
            className="btn btn-outline-success"
            onClick={() => saveWord(item.word)}
          >
            Save
          </button>
        </li>
      );
      rhymes_elements.push(list_el);
    }
  }

  const synonyms_elements = [];
  for (const item of synonyms_list) {
    const list_el_syn = (
      <li key={item.word}>
        {item.word}{' '}
        <button
          className="btn btn-outline-success"
          onClick={() => saveWord(item.word)}
        >
          Save
        </button>
      </li>
    );
    synonyms_elements.push(list_el_syn);
  }

  return (
    <div className="container">
      {savedWordsOutput ? (
        <p>Saved words: {savedWordsOutput}</p>
      ) : (
        <p>Saved words: (None)</p>
      )}
      <input ref={inputEl} type="text"></input>
      <button
        className="btn btn-primary"
        onClick={() => {
          setSynonymsVisible(false);
          setRhymesVisible(true);
          showRhymes();
        }}
      >
        Show rhyming words
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => {
          setSynonymsVisible(true);
          setRhymesVisible(false);
          showSynonyms();
        }}
      >
        Show synonyms
      </button>
      <br />
      <h2 className="col">{description}</h2>
      {rhymesVisible ? <ul>{rhymes_elements}</ul> : null}
      {synonymsVisible ? (
        <ul>{synonyms_elements}</ul>
      ) : null}
    </div>
  );
}

export default RhymeFinderApp;
