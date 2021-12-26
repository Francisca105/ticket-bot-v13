import { model, Schema, Document } from "mongoose";

interface TicketsInterface extends Document {
	id: string;
	user: string;
	canal: string;
	closed: boolean;
}

const TicketsSchema = new Schema({
	id: { type: String, require: true },
	user: { type: String, require: true },
	canal: { type: String, require: true },
	closed: { type: Boolean, default: false, require: true }
});

const TicketsModel = model<TicketsInterface>("tickets", TicketsSchema);

export { TicketsModel, TicketsInterface };
export default TicketsModel;