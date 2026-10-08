"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModule = exports.ModuleStatus = void 0;
const typeorm_1 = require("typeorm");
const course_entity_1 = require("../../course/entities/course.entity");
const lesson_entity_1 = require("../../lesson/entities/lesson.entity");
var ModuleStatus;
(function (ModuleStatus) {
    ModuleStatus["DRAFT"] = "draft";
    ModuleStatus["PUBLISHED"] = "published";
    ModuleStatus["ARCHIVED"] = "archived";
})(ModuleStatus || (exports.ModuleStatus = ModuleStatus = {}));
let CourseModule = class CourseModule {
    id;
    course_id;
    course;
    lessons;
    title;
    description;
    thumbnail;
    order;
    status;
    created_at;
    updated_at;
    deleted_at;
};
exports.CourseModule = CourseModule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CourseModule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CourseModule.prototype, "course_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.Course, (course) => course.modules, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'course_id' }),
    __metadata("design:type", course_entity_1.Course)
], CourseModule.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lesson_entity_1.Lesson, (lesson) => lesson.module),
    __metadata("design:type", Array)
], CourseModule.prototype, "lessons", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CourseModule.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CourseModule.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CourseModule.prototype, "thumbnail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], CourseModule.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ModuleStatus,
        default: ModuleStatus.DRAFT,
    }),
    __metadata("design:type", String)
], CourseModule.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CourseModule.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CourseModule.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], CourseModule.prototype, "deleted_at", void 0);
exports.CourseModule = CourseModule = __decorate([
    (0, typeorm_1.Entity)('modules')
], CourseModule);
//# sourceMappingURL=module.entity.js.map