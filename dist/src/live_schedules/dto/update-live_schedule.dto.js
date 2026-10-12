"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLiveScheduleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_live_schedule_dto_1 = require("./create-live_schedule.dto");
class UpdateLiveScheduleDto extends (0, mapped_types_1.PartialType)(create_live_schedule_dto_1.CreateLiveScheduleDto) {
}
exports.UpdateLiveScheduleDto = UpdateLiveScheduleDto;
//# sourceMappingURL=update-live_schedule.dto.js.map