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
exports.Course = exports.CourseVisibility = exports.CourseStatus = exports.DurationUnit = exports.CourseLevel = void 0;
const typeorm_1 = require("typeorm");
const ctagory_entity_1 = require("../../ctagories/entities/ctagory.entity");
const mentor_entity_1 = require("../../mentors/entities/mentor.entity");
const module_entity_1 = require("../../module/entities/module.entity");
const batch_entity_1 = require("../../batch/entities/batch.entity");
var CourseLevel;
(function (CourseLevel) {
    CourseLevel["BEGINNER"] = "beginner";
    CourseLevel["INTERMEDIATE"] = "intermediate";
    CourseLevel["ADVANCED"] = "advanced";
})(CourseLevel || (exports.CourseLevel = CourseLevel = {}));
var DurationUnit;
(function (DurationUnit) {
    DurationUnit["HOURS"] = "hours";
    DurationUnit["DAYS"] = "days";
    DurationUnit["WEEKS"] = "weeks";
    DurationUnit["MONTHS"] = "months";
})(DurationUnit || (exports.DurationUnit = DurationUnit = {}));
var CourseStatus;
(function (CourseStatus) {
    CourseStatus["DRAFT"] = "draft";
    CourseStatus["PUBLISHED"] = "published";
    CourseStatus["ARCHIVED"] = "archived";
})(CourseStatus || (exports.CourseStatus = CourseStatus = {}));
var CourseVisibility;
(function (CourseVisibility) {
    CourseVisibility["PUBLIC"] = "public";
    CourseVisibility["PRIVATE"] = "private";
    CourseVisibility["UNLISTED"] = "unlisted";
})(CourseVisibility || (exports.CourseVisibility = CourseVisibility = {}));
let Course = class Course {
    id;
    category_id;
    category;
    title;
    slug;
    course_code;
    short_description;
    description;
    thumbnail;
    intro_video_url;
    level;
    language;
    duration;
    duration_unit;
    status;
    visibility;
    mentors;
    modules;
    batches;
    published_at;
    created_at;
    updated_at;
    deleted_at;
};
exports.Course = Course;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Course.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Course.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ctagory_entity_1.CourseCategory, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", ctagory_entity_1.CourseCategory)
], Course.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Course.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Course.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Course.prototype, "course_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Course.prototype, "short_description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Course.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Course.prototype, "thumbnail", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Course.prototype, "intro_video_url", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CourseLevel,
        default: CourseLevel.BEGINNER,
    }),
    __metadata("design:type", String)
], Course.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'English' }),
    __metadata("design:type", String)
], Course.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Course.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DurationUnit,
        default: DurationUnit.HOURS,
    }),
    __metadata("design:type", String)
], Course.prototype, "duration_unit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CourseStatus,
        default: CourseStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Course.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CourseVisibility,
        default: CourseVisibility.PUBLIC,
    }),
    __metadata("design:type", String)
], Course.prototype, "visibility", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => mentor_entity_1.Mentor, { eager: false }),
    (0, typeorm_1.JoinTable)({
        name: 'course_mentors',
        joinColumn: { name: 'course_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'mentor_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Course.prototype, "mentors", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => module_entity_1.CourseModule, (module) => module.course),
    __metadata("design:type", Array)
], Course.prototype, "modules", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => batch_entity_1.Batch, (batch) => batch.course),
    __metadata("design:type", Array)
], Course.prototype, "batches", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Course.prototype, "published_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Course.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Course.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Course.prototype, "deleted_at", void 0);
exports.Course = Course = __decorate([
    (0, typeorm_1.Entity)('courses')
], Course);
//# sourceMappingURL=course.entity.js.map