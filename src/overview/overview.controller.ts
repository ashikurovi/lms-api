import { Controller, Get, UseGuards, Query, Request } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('overview')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) { }

  @Get('admin')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  getAdminOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.overviewService.getAdminOverview(startDate, endDate);
  }

  @Get('student')
  @Roles(UserRole.STUDENT)
  getStudentOverview(@Request() req: any) {
    return this.overviewService.getStudentOverview(req.user.id);
  }
}
