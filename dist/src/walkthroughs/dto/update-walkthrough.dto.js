"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWalkthroughDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_walkthrough_dto_1 = require("./create-walkthrough.dto");
class UpdateWalkthroughDto extends (0, mapped_types_1.PartialType)(create_walkthrough_dto_1.CreateWalkthroughDto) {
}
exports.UpdateWalkthroughDto = UpdateWalkthroughDto;
//# sourceMappingURL=update-walkthrough.dto.js.map