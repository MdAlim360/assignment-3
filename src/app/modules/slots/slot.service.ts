import httpStatus from "http-status";
import { TSlot } from "./slot.interface";
import { Slot } from "./slot.model";
import AppError from "../../errors/appError";
import QueryBuilder from "../../builder/queryBuilder";

const createSlotInToDb = async (payload: TSlot) => {
    const newSlots = [];
    const tempData = { ...payload }; // Clone the payload to avoid mutating the input
    const slotTime = 60; // Slot duration in minutes

    // Parse start time
    const [startHourStr, startMinuteStr] = payload.startTime.split(':');
    const startHour = parseInt(startHourStr, 10);
    const startMinute = parseInt(startMinuteStr, 10);
    const startTotalMinutes = startHour * 60 + startMinute;

    // Parse end time
    const [endHourStr, endMinuteStr] = payload.endTime.split(':');
    const endHour = parseInt(endHourStr, 10);
    const endMinute = parseInt(endMinuteStr, 10);
    const endTotalMinutes = endHour * 60 + endMinute;

    // Check for existing slots
    const existingSlots = await Slot.find({
        room: payload.room,
        date: payload.date,
        $or: [
            { startTime: { $lt: payload.endTime }, endTime: { $gt: payload.startTime } }
        ]
    });

    if (existingSlots.length > 0) {
        throw new AppError(httpStatus.CONFLICT, "Slots overlap with existing slots");
    }

    //end time can not be exceeds than 24 hours
    if (endTotalMinutes > 1440) {
        throw new AppError(httpStatus.CONFLICT, "End time can not be exceeds more than 24 hours ");
    }

    // Calculate total duration and number of slots
    const totalDuration = endTotalMinutes - startTotalMinutes;
    const numberOfSlots = Math.floor(totalDuration / slotTime);

    for (let i = 0; i < numberOfSlots; i++) {
        const currentStartTotalMinutes = startTotalMinutes + i * slotTime;
        const currentEndTotalMinutes = currentStartTotalMinutes + slotTime;

        // Stop if the end time of the current slot exceeds the provided end time
        if (currentEndTotalMinutes > endTotalMinutes) {
            break;
        }

        const currentStartHour = Math.floor(currentStartTotalMinutes / 60);
        const currentStartMinute = currentStartTotalMinutes % 60;
        const currentEndHour = Math.floor(currentEndTotalMinutes / 60);
        const currentEndMinute = currentEndTotalMinutes % 60;

        const startTimeFormatted = `${currentStartHour.toString().padStart(2, '0')}:${currentStartMinute.toString().padStart(2, '0')}`;
        const endTimeFormatted = `${currentEndHour.toString().padStart(2, '0')}:${currentEndMinute.toString().padStart(2, '0')}`;

        newSlots.push({

            room: tempData.room,
            date: tempData.date,
            startTime: startTimeFormatted,
            endTime: endTimeFormatted,
            isBooked: false,
        });
    }

    const addSlots = await Slot.create(newSlots);
    return addSlots

};

const getSlotFromDb = async (query: Record<string, unknown>) => {
    const slotQuery = new QueryBuilder(Slot.find(), query)
    const result = await slotQuery.filter().modelQuery;
    if (result.length == 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'slots are not available')
    }
    return result;

}
export const slotService = {
    createSlotInToDb,
    getSlotFromDb
};
