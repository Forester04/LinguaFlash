// Generated by Xata Codegen 0.29.4. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "sets",
    columns: [
      { name: "title", type: "string" },
      { name: "description", type: "text" },
      { name: "private", type: "bool", defaultValue: "true" },
      { name: "creator", type: "string" },
      { name: "image", type: "file", file: { defaultPublicAccess: true } },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Sets = InferredTypes["sets"];
export type SetsRecord = Sets & XataRecord;

export type DatabaseSchema = {
  sets: SetsRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Forester-Kisiara-s-workspace-mv8895.us-east-1.xata.sh/db/linguaFlash",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(fetch: any, options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options, fetch }, tables);
  }
  // constructor(options?: BaseClientOptions) {
  //   super({ ...defaultOptions, ...options }, tables);
  // }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = (fetch: any) => {
  if (instance) return instance;

  instance = new XataClient(fetch);
  return instance;
};