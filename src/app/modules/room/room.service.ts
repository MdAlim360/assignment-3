import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { TRoom } from "./room.interface";
import { Room } from "./room.model";

const createRoomIntoDb = async (payload: TRoom) => {
    try {
        const newRoom = await Room.create(payload);
        return newRoom
    } catch (error: any) {
        throw new Error(error)
    }
}

const getAllRoomsFromDb = async () => {
    const result = await Room.find();
    if (result.length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Data is not found!')
    }
    return result;

}
const getSingleRoomFromDb = async (id: string) => {
    const result = await Room.findById(id);
    return result;
}

const updateRoomInToDb = async (id: string, payload: Partial<TRoom>) => {
    try {
        const result = await Room.findByIdAndUpdate(
            id,
            payload,
            {
                new: true,
                runValidators: true
            }
        )
        return result;

    } catch (error: any) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update room!');
    }
}

const deleteRoomFromDb = async (id: string) => {
    const result = await Room.findByIdAndUpdate(
        id,
        { isDeleted: true },
        {
            new: true,
        },
    );
    return result;
};

export const roomService = {
    createRoomIntoDb,
    getAllRoomsFromDb,
    getSingleRoomFromDb,
    updateRoomInToDb,
    deleteRoomFromDb
}