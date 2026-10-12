import { HttpStatus } from '@nestjs/common';
import { LiveSchedulesService } from './live_schedules.service';
import { CreateLiveScheduleDto } from './dto/create-live_schedule.dto';
import { UpdateLiveScheduleDto } from './dto/update-live_schedule.dto';
export declare class LiveSchedulesController {
    private readonly liveSchedulesService;
    constructor(liveSchedulesService: LiveSchedulesService);
    create(createLiveScheduleDto: CreateLiveScheduleDto, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/live_schedule.entity").LiveSchedule;
    }>;
    findAll(page?: string, limit?: string, search?: string, batchId?: string, mentorId?: string, status?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/live_schedule.entity").LiveSchedule[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/live_schedule.entity").LiveSchedule;
    }>;
    update(id: string, updateLiveScheduleDto: UpdateLiveScheduleDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/live_schedule.entity").LiveSchedule & {
            endTime: Date;
            startTime: Date;
            batchId?: string;
            mentorId?: string;
            title?: string;
            description?: string;
            platform?: "google_meet" | "zoom";
            meetingUrl?: string;
            meetingId?: string;
            meetingPassword?: string;
            status?: "scheduled" | "live" | "completed" | "cancelled";
            createdBy?: string;
        };
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/live_schedule.entity").LiveSchedule;
    }>;
}
