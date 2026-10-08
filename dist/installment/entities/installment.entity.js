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
exports.Installment = exports.InstallmentStatus = void 0;
const typeorm_1 = require("typeorm");
const enrollment_entity_1 = require("../../enrollment/entities/enrollment.entity");
const payment_entity_1 = require("../../payments/entities/payment.entity");
var InstallmentStatus;
(function (InstallmentStatus) {
    InstallmentStatus["PENDING"] = "PENDING";
    InstallmentStatus["DUE"] = "DUE";
    InstallmentStatus["PARTIAL"] = "PARTIAL";
    InstallmentStatus["PAID"] = "PAID";
    InstallmentStatus["OVERDUE"] = "OVERDUE";
    InstallmentStatus["CANCELLED"] = "CANCELLED";
})(InstallmentStatus || (exports.InstallmentStatus = InstallmentStatus = {}));
let Installment = class Installment {
    id;
    enrollment_id;
    enrollment;
    installment_number;
    amount;
    paid_amount;
    due_amount;
    due_date;
    status;
    payments;
    created_at;
    updated_at;
};
exports.Installment = Installment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Installment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Installment.prototype, "enrollment_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => enrollment_entity_1.Enrollment, (enrollment) => enrollment.installments, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'enrollment_id' }),
    __metadata("design:type", enrollment_entity_1.Enrollment)
], Installment.prototype, "enrollment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Installment.prototype, "installment_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Installment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Installment.prototype, "paid_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Installment.prototype, "due_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Installment.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: InstallmentStatus,
        default: InstallmentStatus.PENDING,
    }),
    __metadata("design:type", String)
], Installment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payment, (payment) => payment.installment),
    __metadata("design:type", Array)
], Installment.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Installment.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Installment.prototype, "updated_at", void 0);
exports.Installment = Installment = __decorate([
    (0, typeorm_1.Entity)('installments')
], Installment);
//# sourceMappingURL=installment.entity.js.map