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
    }>;
    remove(id: string): Promise<LiveSchedule>;
}
