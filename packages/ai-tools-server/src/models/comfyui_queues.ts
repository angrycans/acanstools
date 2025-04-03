import { Schema, model, Date, Document } from "mongoose";
interface IFile {
  iname: string;
  type: string;
  path: string;
}

enum ComfyuiStatus {
  start = "start",
  pending = "pending",
  failed = "failed",
  success = "success",
}

interface IComfyuiQueue extends Document {
  client_id: string;
  workflow: string;
  status: ComfyuiStatus;
  progress: number;
  creat_at: Date;
  errmsg?: string;
  user_union_id: string;
  user_mobile: string;
  files: IFile[];
}

const fileSchema = new Schema<IFile>({
  iname: { type: String, required: true },
  type: { type: String, required: true },
  path: { type: String, required: true },
});

const ComfyuiQueueSchema = new Schema<IComfyuiQueue>({
  client_id: { type: String, required: true },
  workflow: { type: String, required: true },
  status: { type: String, enum: Object.values(ComfyuiStatus), required: true },
  progress: { type: Number, required: true },
  creat_at: { type: Date, default: Date.now },
  errmsg: { type: String },
  user_union_id: { type: String, required: true },
  user_mobile: { type: String, required: true },
  files: { type: [fileSchema], default: [] },
});

const ComfyuiQueue = model<IComfyuiQueue>("ComfyuiQueue", ComfyuiQueueSchema);


export { ComfyuiQueue, ComfyuiStatus }