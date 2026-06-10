import { ApiError } from "../utils/ApiError.js";

const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

const charMap: Record<string, number> = {};
for (let i = 0; i < characters.length; i++) {
    charMap[characters[i]] = i;
}

function reverseString(str : string) {
  const charArray = str.split('');
  const reversedArray = charArray.reverse();
  const reversedStr = reversedArray.join('');
  return reversedStr;
}



export const encode = (id : number)=>{
    if( id === 0) return "0";
     
    let encodedString = "";

    while(id){
        encodedString += characters[id%62] ;
        id = Math.floor(id / 62);
    }

    encodedString = reverseString(encodedString) ;
    return encodedString
    
}

export const decode = (encodedString : string)=>{
    let id = 0;


    for(let i = 0 ; i< encodedString.length ; i++){
        if (charMap[encodedString[i]] === undefined) {
            throw new ApiError(400,"Invalid character in Short Code");
        }
        id = (id*62) + charMap[encodedString[i]] ;
    }
    return id ;
}