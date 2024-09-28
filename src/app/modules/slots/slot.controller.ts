import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { slotService } from "./slot.service";

const createSlot = catchAsync(async (req, res) => {
    const slotData = req.body;
    const result = await slotService.createSlotInToDb(slotData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "slots are created successfully",
        data: result
    })
});

const getSlots = catchAsync(async (req, res) => {
    const slotData = req.body;
    const result = await slotService.getSlotFromDb(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "slots are retrieved successfully",
        data: result
    })
});

export const slotController = {
    createSlot,
    getSlots,
}