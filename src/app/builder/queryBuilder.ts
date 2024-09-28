import { FilterQuery, Query } from "mongoose";
import { TSlot } from "../modules/slots/slot.interface";

class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, unknown>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    filter() {
        const { date, roomId } = this.query;


        const filters = { date: date, room: roomId, isBooked: { $ne: true } };
        const getAllSlots = { isBooked: { $ne: true } }
        console.log(filters);
        if (filters.date) {
            this.modelQuery = this.modelQuery.find(
                filters,
            );
        }
        else {
            this.modelQuery = this.modelQuery.find(
                getAllSlots
            );
        }
        return this;
    }
}

export default QueryBuilder;