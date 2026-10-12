"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMentorDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_mentor_dto_1 = require("./create-mentor.dto");
class UpdateMentorDto extends (0, mapped_types_1.PartialType)(create_mentor_dto_1.CreateMentorDto) {
}
exports.UpdateMentorDto = UpdateMentorDto;
//# sourceMappingURL=update-mentor.dto.js.map