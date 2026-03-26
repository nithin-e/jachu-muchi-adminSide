import { Schema } from "yup";

export type ValidationOptions = {
  body?: Schema;
  query?: Schema;
  params?: Schema;
};
