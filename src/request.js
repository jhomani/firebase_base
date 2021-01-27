const request = require("request");

const response = async () => {
  let response;
  response = await request("https://jsonplaceholder.typicode.com/posts", (error, response, body) => {
    return body;
  }).then((res) => res.json());
  console.log(response);
};

response();
