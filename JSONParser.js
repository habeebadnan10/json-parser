
//Parser Function assuming the js string is proper
function JSONParser(jstring){
    // This controller handles all the data types
  if(jstring[0] === '"') return jstring.slice(1, jstring.length-1);    // check for strings
  if(jstring[0] === 't') return true;                                  // check for true Boolean
  if(jstring[0] === 'f') return false;                                 // check for false Boolean
  if(jstring[0] === 'u') return undefined;                             // check for undefined
  if(jstring[0] === 'n') return null;                                  // check for null values
  if(jstring.charCodeAt() >= 48 && jstring.charCodeAt() <= 57) return Number(jstring);   // checks for number
  if(jstring[0] === '[') return parseArray(jstring);                    // check and parse Arrays
  if(jstring[0] === '{') return parseObj(jstring);                      // check and parse Objects
}


const openings = {
  '"': '"',
  '[': ']',
  '{': '}'
};

const stack = [];

function parseArray(jstring){
  const output = [];
  // for empty array
  if(jstring.length < 3) return output;
  const valueStr = jstring.slice(1, jstring.length-1)      // removes sqaure braces
  let start = 0;
  for(let i = 0; i <= valueStr.length; i++){

    if(stack[stack.length-1] === valueStr[i] && stack[stack.length-1] !== '"' || 
      stack[stack.length-1] === valueStr[i] && valueStr[i] === '"'){
      stack.pop();
    } else if(openings[valueStr[i]] && stack[stack.length-1] !== '"'){
      stack.push(openings[valueStr[i]]);
    }
    if (!stack.length && valueStr[i] === ',' || i === valueStr.length) {
      const curVal = JSONParser(valueStr.slice(start, i));
      output.push(curVal);
      start = i+1;
    }
  }
  return output;
}

//parseObj is quite simliar to parseArray with minimal changes

function parseObj(jstring){
  const output = {};
  // for empty obj
  if(jstring.length < 3) return output;
  const valueStr = jstring.slice(1, jstring.length-1)
  let start = 0;
  let key;
  let val;
  for(let i = 0; i <= valueStr.length; i++){

    if(stack[stack.length-1] === valueStr[i] && stack[stack.length-1] !== '"' || 
      stack[stack.length-1] === valueStr[i] && valueStr[i] === '"'){
      stack.pop();
    } else if(openings[valueStr[i]] && stack[stack.length-1] !== '"'){
      stack.push(openings[valueStr[i]]);
    }
    if (!stack.length){
      if (valueStr[i] === ':'){
        key = JSONParser(valueStr.slice(start, i))
        start = i+1;
      }
      if (valueStr[i] === ',' || i === valueStr.length){
        val = JSONParser(valueStr.slice(start, i));
        start = i+1;
        output[key] = val;
      }
    }
  }
  return output;
}