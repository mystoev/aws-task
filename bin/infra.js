import { App } from "aws-cdk-lib";
import InfraStack from "../lib/infra-stack.js";

const app = new App();
new InfraStack(app, "InfraStack");
