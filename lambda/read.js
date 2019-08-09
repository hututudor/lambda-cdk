const aws = require("aws-sdk");
aws.config.update({ region: "us-east-1" });

exports.handler = async function(event) {
  // Log every request
  console.log("request:", JSON.stringify(event, undefined, 2));

  // Create a db connection
  const db = new aws.DynamoDB.DocumentClient();

  const res = await db
    .scan({
      TableName: process.env.TABLE_NAME,
    })
    .promise();

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(res)
  };
};