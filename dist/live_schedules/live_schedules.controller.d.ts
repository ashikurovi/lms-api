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
            endTime?: string | Date | null | undefined;
            startTime?: string | Date | undefined;
            batchId?: string | undefined;
            mentorId?: string | undefined;
            title?: string | undefined;
            description?: string | undefined;
            platform?: "google_meet" | "zoom" | undefined;
            meetingUrl?: string | undefined;
            meetingId?: string | undefined;
            meetingPassword?: string | undefined;
            status?: "scheduled" | "live" | "completed" | "cancelled" | undefined;
            createdBy?: string | undefined;
        };
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/live_schedule.entity").LiveSchedule;
    }>;
}
