import { Api, RDS } from "@serverless-stack/resources";

export function MyStack({ stack }) {
  const DATABASE = "MyDatabase";

  // Create the Aurora DB cluster
  const Cluster = new RDS(stack, "Cluster", {
    engine: "postgresql10.14",
    defaultDatabaseName: DATABASE,
    scaling: {
      autoPause: true,
      minCapacity: "ACU_2",
      maxCapacity: "ACU_2",
    },
    migrations: "backend/migrations",
  });

  new Api(stack, "api", {
    routes: {
      "GET /monitor": "functions/lambda.getMonitors",
      "POST /monitor": "functions/lambda.createMonitor",
    },
    defaults: {
      function: {
        environment: {
          DATABASE,
          CLUSTER_ARN: Cluster.clusterArn,
          SECRET_ARN: Cluster.secretArn,
        },
        permissions: [Cluster],
      },
    },
  });
}