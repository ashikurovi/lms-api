export declare class CreateLiveScheduleDto {
    batchId: string;
    mentorId?: string;
    title: string;
    description?: string;
    startTime: string;
    endTime?: string;
    platform: 'google_meet' | 'zoom';
    meetingUrl: string;
    meetingId?: string;
    meetingPassword?: string;
    status?: 'scheduled' | 'live' | 'completed' | 'cancelled';
    createdBy?: string;
}
