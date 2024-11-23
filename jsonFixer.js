module.exports.fixJson = fixJson;

function fixJson(json) {
  const STATE = {
    stack: [],
    inString: false,
    lastKey: '',
    currentKey: '',
    isCollectingKey: false
  };

  // Process the input JSON and analyze structure
  let result = processJsonString(json, STATE);
  
  // Apply fixes in sequence
  result = fixIncompleteString(result, STATE.inString);
  result = fixIncompleteKeyValue(result);
  result = fixEmptyObject(result);
  result = closeRemainingStructures(result, STATE.stack);
  
  return result;
}

function processJsonString(json, state) {
  for (let i = 0; i < json.length; i++) {
    const char = json[i];
    
    if (isQuote(char, json, i)) {
      handleQuote(state);
    } else if (state.inString && state.isCollectingKey) {
      state.currentKey += char;
    }
    
    if (!state.inString) {
      handleStructuralChar(char, state);
    }
    
    handleKeyCollection(char, json, i, state);
  }
  return json;
}

function isQuote(char, json, index) {
  return char === '"' && (index === 0 || json[index-1] !== '\\');
}

function handleQuote(state) {
  state.inString = !state.inString;
  if (!state.inString && state.isCollectingKey) {
    state.isCollectingKey = false;
    state.lastKey = state.currentKey;
    state.currentKey = '';
  }
}

function handleStructuralChar(char, state) {
  const structureMap = {
    '{': '}',
    '[': ']'
  };
  
  if (char in structureMap) {
    state.stack.push(structureMap[char]);
  } else if (char === '}' || char === ']') {
    state.stack.pop();
  }
}

function handleKeyCollection(char, json, index, state) {
  if (char === ':' && !state.inString) {
    state.isCollectingKey = false;
  } else if (char === '"' && !state.inString && json[index-1] === ':') {
    state.isCollectingKey = true;
  }
}

function fixIncompleteString(json, inString) {
  return inString ? json + '"' : json;
}

function fixIncompleteKeyValue(json) {
  let result = json;
  
  if (result.endsWith(':')) {
    result += '"VALUE"';
  }
  
  const lastChar = result.trim().slice(-1);
  if (isIncompleteKey(lastChar, result)) {
    result += ':"VALUE"';
  }
  
  return result;
}

function isIncompleteKey(lastChar, json) {
  if (lastChar !== '"' || json.endsWith('":"') || json.endsWith('\\"')) {
    return false;
  }
  
  let i = json.length - 1;
  let colonFound = false;
  
  while (i >= 0) {
    if (json[i] === ':') {
      colonFound = true;
      break;
    }
    if (json[i] === '{' || json[i] === ',') {
      break;
    }
    i--;
  }
  
  return !colonFound;
}

function fixEmptyObject(json) {
  return json.endsWith('{') ? json + '"UNKNOWN_KEY":"VALUE"' : json;
}

function closeRemainingStructures(json, stack) {
  return json + stack.reverse().join('');
}