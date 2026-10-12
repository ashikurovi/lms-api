import { OverviewService } from './overview.service';
export declare class OverviewController {
    private readonly overviewService;
    constructor(overviewService: OverviewService);
    getPublicStats(): Promise<{
        expertTrainers: number;
        programs: number;
        students: number;
        courseVideos: number;
        liveClasses: number;
        yearsOfExperience: number;
    }>;
    getAdminOverview(startDate?: string, endDate?: string): Promise<{
        totalRevenue: number;
        totalDues: number;
        totalEnrollments: number;
    }>;
    getStudentOverview(req: any): Promise<{
        totalPayable: number;
        totalPaid: number;
        totalDue: number;
        upcomingInstallments: import("../installment/entities/installment.entity").Installment[];
        paymentHistory: import("../payments/entities/payment.entity").Payment[];
    }>;
}
