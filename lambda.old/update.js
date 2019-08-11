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
  if (!body.id) {
    return {
      statusCode: 401
    };
  }

  const res = await db
    .update({
      TableName: process.env.TABLE_NAME,
      Key: { id: body.id },
      UpdateExpression: "set #status = :done",
      ExpressionAttributeNames: {'#status': 'status'},
      ReturnValues: "UPDATED_NEW",
      ExpressionAttributeValues: {
        ':done': 'done'
      }
    })
    .promise();

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(res)
  };
};
