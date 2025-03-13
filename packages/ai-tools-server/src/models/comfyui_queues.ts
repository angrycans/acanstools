import { timeStamp } from "console";
import { Schema, model, Date } from "mongoose";

const fileSchema = new Schema(
  {
    iname: String,
    type: String,
    path: String
  },
  { _id: false } // <-- disable `_id`
);


enum Status {
  start,
  pending,
  progress,
  failed,
  success,
};



const ComfyuiQueueSchema = new Schema({
  client_id: String,
  workflow: String,
  status: {
    type: String,
    enum: Status,
  },
  progress: Number,
  creat_at: { type: Date, default: Date.now },
  errmsg: String,
  user_open_id: String,
  user_mobile: String,
  files: [fileSchema]
});

export default model("ComfyuiQueue", ComfyuiQueueSchema);
