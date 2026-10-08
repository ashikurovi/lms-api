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
exports.Batch = exports.ClassType = exports.BatchMode = exports.BatchStatus = void 0;
const typeorm_1 = require("typeorm");
const course_entity_1 = require("../../course/entities/course.entity");
var BatchStatus;
(function (BatchStatus) {
    BatchStatus["UPCOMING"] = "upcoming";
    BatchStatus["OPEN"] = "open";
    BatchStatus["ONGOING"] = "ongoing";
    BatchStatus["COMPLETED"] = "completed";
    BatchStatus["CANCELLED"] = "cancelled";
})(BatchStatus || (exports.BatchStatus = BatchStatus = {}));
var BatchMode;
(function (BatchMode) {
    BatchMode["ONLINE"] = "online";
    BatchMode["OFFLINE"] = "offline";
    BatchMode["HYBRID"] = "hybrid";
})(BatchMode || (exports.BatchMode = BatchMode = {}));
var ClassType;
(function (ClassType) {
    ClassType["LIVE"] = "live";
    ClassType["RECORDED"] = "recorded";
    ClassType["SELF_PACED"] = "self_paced";
})(ClassType || (exports.ClassType = ClassType = {}));
let Batch = class Batch {
    id;
    course_id;
    course;
    name;
    code;
    start_date;
    end_date;
    registration_start;
    registration_end;
    capacity;
    enrolled_count;
    status;
    mode;
    class_type;
    timezone;
    price;
    discount_price;
    fb_group_link;
    created_at;
    updated_at;
    deleted_at;
};
exports.Batch = Batch;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Batch.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Batch.prototype, "course_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.Course, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'course_id' }),
    __metadata("design:type", course_entity_1.Course)
], Batch.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Batch.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Batch.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Batch.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Batch.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Batch.prototype, "registration_start", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Batch.prototype, "registration_end", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Batch.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Batch.prototype, "enrolled_count", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BatchStatus,
        default: BatchStatus.UPCOMING,
    }),
    __metadata("design:type", String)
], Batch.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BatchMode,
        default: BatchMode.ONLINE,
    }),
    __metadata("design:type", String)
], Batch.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ClassType,
        default: ClassType.LIVE,
    }),
    __metadata("design:type", String)
], Batch.prototype, "class_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Asia/Dhaka' }),
    __metadata("design:type", String)
], Batch.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Batch.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Batch.prototype, "discount_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Batch.prototype, "fb_group_link", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Batch.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Batch.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Batch.prototype, "deleted_at", void 0);
exports.Batch = Batch = __decorate([
    (0, typeorm_1.Entity)('batches')
], Batch);
//# sourceMappingURL=batch.entity.js.map