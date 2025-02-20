import { timeStamp } from "console";
import { Schema, model,Date } from "mongoose";

const fileSchema = new Schema(
  { iname: String ,
  type:String,
  path:String},
  { _id: false } // <-- disable `_id`
);


const ComfyuiQueueSchema = new Schema({
  client_id: String, 
  workflow: String,
  status: Number,
  creat_at: { type: Date, default: Date.now },
  msg:String,
  user_open_id:String,
  user_mobile:String,
  files:[fileSchema]
});

export default model("ComfyuiQueue", ComfyuiQueueSchema);
