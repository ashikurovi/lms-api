import { Batch } from '../../batch/entities/batch.entity';
import { User } from '../../users/entities/user.entity';
export declare class LiveSchedule {
    id: string;
    batchId: string;
    batch: Batch;
    mentorId?: string;
    mentor?: User;
    title: string;
    description?: string;
    startTime: Date;
    endTime?: Date;
    platform: 'google_meet' | 'zoom';
    meetingUrl: string;
    meetingId?: string;
    meetingPassword?: string;
    status: 'scheduled' | 'live' | 'completed' | 'cancelled';
    createdBy?: string;
    creator?: User;
    createdAt: Date;
    updatedAt: Date;
}
