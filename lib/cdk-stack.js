const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const apigw = require('@aws-cdk/aws-apigateway');
const dynamodb = require('@aws-cdk/aws-dynamodb');

class CdkStack extends cdk.Stack {
  // @ts-ignore
  constructor(scope, id, props) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'Tds', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    });

    const createFunction = new lambda.Function(this, 'create', {
      runtime: lambda.Runtime.NODEJS_8_10,
      code: lambda.Code.asset('lambda'),
      handler: 'create.handler',
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    const readFunction = new lambda.Function(this, 'read', {
      runtime: lambda.Runtime.NODEJS_8_10,
      code: lambda.Code.asset('lambda'),
      handler: 'read.handler',
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    const updateFunction = new lambda.Function(this, 'update', {
      runtime: lambda.Runtime.NODEJS_8_10,
      code: lambda.Code.asset('lambda'),
      handler: 'update.handler',
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    const deleteFunction = new lambda.Function(this, 'delete', {
      runtime: lambda.Runtime.NODEJS_8_10,
      code: lambda.Code.asset('lambda'),
      handler: 'delete.handler',
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    table.grantReadWriteData(createFunction);
    table.grantReadWriteData(readFunction);
    table.grantReadWriteData(updateFunction);
    table.grantReadWriteData(deleteFunction);

    const api = new apigw.LambdaRestApi(this, 'apigw', {
      handler: createFunction,
      proxy: false
    });

    const todoRes = api.root.addResource('todo');

    const createTodo = new apigw.LambdaIntegration(createFunction);
    todoRes.addMethod('PUT', createTodo);

    const readTodo = new apigw.LambdaIntegration(readFunction);
    api.root.addResource('todos').addMethod('GET', readTodo);

    const updateTodo = new apigw.LambdaIntegration(updateFunction);
    todoRes.addMethod('POST', updateTodo);

    const deleteTodo = new apigw.LambdaIntegration(deleteFunction);
    todoRes.addMethod('DELETE', deleteTodo);
  }
}

module.exports = { CdkStack };
