import "dotenv/config";
import { App } from "aws-cdk-lib";
import EntryTaskStack from "./entry-task-stack.js";

const props = process.env;

const app = new App();
new EntryTaskStack(app, "EntryTaskStack", props);
