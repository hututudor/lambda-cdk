const aws = require("aws-sdk");
aws.config.update({ region: "us-east-1" });

exports.handler = async function(event) {
  // Log every request
  console.log("request:", JSON.stringify(event, undefined, 2));

  // Parse the body
  const body = JSON.parse(event.body);

  // Create a db connection
  const db = new aws.DynamoDB.DocumentClient();

  // Validate the input
  if(!body.id || !body.name) {
    return {
      statusCode: 401,
    }
  }

  let item = {
    id: body.id,
    name: body.name,
    status: 'progress',
    created_at:new Date().toISOString()
  };

  const res = await db
    .put({
      TableName: process.env.TABLE_NAME,
      Item: item,
      ReturnValues: "ALL_OLD"
    })
    .promise();

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(item)
  };
};
