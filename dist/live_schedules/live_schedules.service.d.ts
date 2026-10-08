import { Repository } from 'typeorm';
import { CreateLiveScheduleDto } from './dto/create-live_schedule.dto';
import { UpdateLiveScheduleDto } from './dto/update-live_schedule.dto';
import { LiveSchedule } from './entities/live_schedule.entity';
export declare class LiveSchedulesService {
    private liveScheduleRepository;
    constructor(liveScheduleRepository: Repository<LiveSchedule>);
    create(createLiveScheduleDto: CreateLiveScheduleDto): Promise<LiveSchedule>;
    findAll(pageStr?: string, limitStr?: string, search?: string, batchId?: string, mentorId?: string, status?: string): Promise<{
        items: LiveSchedule[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<LiveSchedule>;
    update(id: string, updateLiveScheduleDto: UpdateLiveScheduleDto): Promise<LiveSchedule & {
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
    }>;
    remove(id: string): Promise<LiveSchedule>;
}
