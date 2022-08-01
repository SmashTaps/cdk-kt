import {
  Stack,
  StackProps,
  aws_apigateway as apigateway,
  aws_lambda as lambda,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class KtStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const restApi = new apigateway.RestApi(this, "test-123-xyz", {
      restApiName: "test-123-xyz",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const paymentCreateLambda = new lambda.Function(
      this,
      "test-123-xyz-lambda",
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        code: lambda.Code.fromAsset(
          path.join(__dirname, "./lambdaFns/payment/create"),
          {
            exclude: ["*.ts"],
          }
        ),
        handler: "index.handler",
      }
    );

    // cdk
    // sdk

    const paymentCreateLambdaInt = new apigateway.LambdaIntegration(
      paymentCreateLambda
    );

    restApi.root.addMethod("GET", paymentCreateLambdaInt);
  }
}
