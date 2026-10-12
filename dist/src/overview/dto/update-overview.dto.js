"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOverviewDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_overview_dto_1 = require("./create-overview.dto");
class UpdateOverviewDto extends (0, mapped_types_1.PartialType)(create_overview_dto_1.CreateOverviewDto) {
}
exports.UpdateOverviewDto = UpdateOverviewDto;
//# sourceMappingURL=update-overview.dto.js.map