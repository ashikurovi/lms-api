"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCourseCategoryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_ctagory_dto_1 = require("./create-ctagory.dto");
class UpdateCourseCategoryDto extends (0, mapped_types_1.PartialType)(create_ctagory_dto_1.CreateCourseCategoryDto) {
}
exports.UpdateCourseCategoryDto = UpdateCourseCategoryDto;
//# sourceMappingURL=update-ctagory.dto.js.map